'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Transcript } from '@/types';
import { generateRecordingId, formatDuration } from '@/lib/audioUtils';
import { Mic, Square, Pause as PauseIcon, Loader2, Trash2, Save } from 'lucide-react';

export function VoiceRecorder() {
  const { 
    isRecording,
    isPaused,
    isProcessing,
    startRecording, 
    pauseRecording,
    resumeRecording,
    stopRecording, 
    setProcessing,
    addTranscript, 
    setError 
  } = useAppStore();
  
  const [duration, setDuration] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [transcript, setTranscript] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        }
      });
      
      // Try to use Fal AI compatible audio formats (mp3, ogg, wav, m4a, aac)
      const mimeTypes = [
        'audio/wav',
        'audio/mp4', // for m4a/aac
        'audio/ogg',
        'audio/mpeg', // for mp3
        'audio/webm;codecs=opus', // fallback
        'audio/webm', // fallback
      ];
      
      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }
      
      console.log('🎙️ Selected audio format:', selectedMimeType || 'default');
      
      const mediaRecorder = selectedMimeType 
        ? new MediaRecorder(stream, { mimeType: selectedMimeType })
        : new MediaRecorder(stream);
      
      streamRef.current = stream;
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('📦 Recording chunk:', {
            size: event.data.size,
            type: event.data.type,
          });
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      // Start recording with 1-second intervals to get regular chunks
      mediaRecorder.start(1000);
      startRecording();
      setDuration(0);
      startTimer();
      setError(null);
      setRecordedChunks([]);
      
    } catch (error) {
      setError('Failed to access microphone. Please check permissions.');
      console.error('Recording error:', error);
    }
  }, [startRecording, startTimer, setError]);

  const handlePauseResume = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      // Resume recording
      mediaRecorderRef.current.start();
      resumeRecording();
      startTimer();
    } else {
      // Pause recording
      mediaRecorderRef.current.stop();
      pauseRecording();
      stopTimer();
      
      // Immediately create a new recorder for the next segment
      if (streamRef.current) {
        const mediaRecorder = new MediaRecorder(streamRef.current);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks(prev => [...prev, event.data]);
          }
        };
        mediaRecorderRef.current = mediaRecorder;
      }
    }
  }, [isPaused, pauseRecording, resumeRecording, startTimer, stopTimer]);

  const handleStopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    stopRecording();
    stopTimer();
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Wait a moment for the final chunk to be processed
    setTimeout(async () => {
      if (recordedChunks.length > 0) {
        // Combine all chunks into one blob, preserving the original MIME type
        const mimeType = recordedChunks[0]?.type || 'audio/webm';
        const finalBlob = new Blob(recordedChunks, { type: mimeType });
        
        console.log('🎵 Final audio blob:', {
          size: finalBlob.size,
          type: finalBlob.type,
          chunksCount: recordedChunks.length,
        });
        
        // Start transcription
        setProcessing(true);
        
        try {
          const formData = new FormData();
          
          // Determine appropriate file extension based on MIME type
          let extension = 'wav';
          if (mimeType.includes('mp4')) extension = 'm4a';
          else if (mimeType.includes('mpeg')) extension = 'mp3';
          else if (mimeType.includes('ogg')) extension = 'ogg';
          else if (mimeType.includes('webm')) extension = 'webm';
          
          formData.append('audio', finalBlob, `recording.${extension}`);
          
          console.log('🎯 Sending audio for transcription...', {
            blobSize: finalBlob.size,
            blobType: finalBlob.type,
          });
          
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });
          
          const result = await response.json();
          
          if (!response.ok) {
            console.error('❌ Transcription API error:', {
              status: response.status,
              statusText: response.statusText,
              result: result,
            });
            
            const errorMessage = result.details 
              ? `${result.error}: ${result.details}` 
              : result.error || 'Transcription failed';
            
            setError(errorMessage);
            
            // Log additional debugging info if available
            if (result.uploadError) {
              console.error('Upload error details:', result.uploadError);
            }
            if (result.transcriptionError) {
              console.error('Transcription error details:', result.transcriptionError);
            }
            if (result.fullError) {
              console.error('Full error details:', result.fullError);
            }
            return;
          }
          
          console.log('✅ Transcription successful:', {
            transcriptLength: result.transcript?.length,
            audioUrl: result.audioUrl,
          });
          
          if (!result.transcript) {
            setError('No transcript was generated from the audio. Please try recording again.');
            return;
          }
          
          setTranscript(result.transcript);
          setShowTranscript(true);
        } catch (error: unknown) {
          const err = error as { message?: string; name?: string; stack?: string };
          console.error('💥 Unexpected transcription error:', {
            message: err.message,
            name: err.name,
            stack: err.stack,
            fullError: error,
          });
          
          setError(`Unexpected error: ${err.message || 'Unknown error'}. Please check the console for details.`);
        } finally {
          setProcessing(false);
        }
      }
    }, 100);
  }, [stopRecording, stopTimer, recordedChunks, setProcessing, setError]);

  const handleDiscardRecording = useCallback(() => {
    setConfirmDiscard(false);
    setRecordedChunks([]);
    setDuration(0);
    setTranscript('');
    setShowTranscript(false);
  }, []);

  const handleSaveTranscript = useCallback(() => {
    if (transcript.trim() && recordedChunks.length > 0) {
      const finalBlob = new Blob(recordedChunks, { type: 'audio/wav' });
      
      const newTranscript: Transcript = {
        id: generateRecordingId(),
        text: transcript.trim(),
        audioBlob: finalBlob,
        audioUrl: URL.createObjectURL(finalBlob),
        createdAt: new Date(),
        updatedAt: new Date(),
        duration: duration,
        status: 'completed',
      };
      
      addTranscript(newTranscript);
      
      // Reset state
      setRecordedChunks([]);
      setDuration(0);
      setTranscript('');
      setShowTranscript(false);
    }
  }, [transcript, recordedChunks, duration, addTranscript]);

  useEffect(() => {
    return () => {
      stopTimer();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [stopTimer]);

  return (
    <div className="space-y-4">
      {/* Processing State */}
      {isProcessing && (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
          <div className="text-center">
            <div className="text-white font-medium mb-1">Transcribing Audio</div>
            <div className="text-white/60 text-sm">Please wait while we process your recording...</div>
          </div>
        </div>
      )}

      {/* Transcript View */}
      {showTranscript && !isProcessing && (
        <div className="space-y-4">
          <div className="text-center text-white/60 text-sm mb-4">
            Review and edit your transcript
          </div>
          
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your transcription will appear here..."
            className="min-h-32 bg-white/5 border-white/20 text-white placeholder:text-white/50 resize-none"
            rows={4}
          />
          
          <div className="flex space-x-2">
            {confirmDiscard ? (
              <div className="flex space-x-2 flex-1">
                <Button
                  onClick={handleDiscardRecording}
                  variant="destructive"
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  Confirm Discard
                </Button>
                <Button
                  onClick={() => setConfirmDiscard(false)}
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/15"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => setConfirmDiscard(true)}
                  variant="outline"
                  className="flex items-center space-x-2 bg-white/10 border-white/20 text-white hover:bg-white/15"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Discard</span>
                </Button>
                <Button
                  onClick={handleSaveTranscript}
                  disabled={!transcript.trim()}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Add to Library</span>
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Recording Controls */}
      {!showTranscript && !isProcessing && (
        <div className="flex flex-col items-center space-y-4">
          {!isRecording && (
            <Button
              onClick={handleStartRecording}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center border-2 border-white/20"
              variant="ghost"
            >
              <Mic className="w-8 h-8 text-white" />
            </Button>
          )}

          {isRecording && (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handlePauseResume}
                  className="w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center"
                  variant="ghost"
                >
                  {isPaused ? (
                    <Mic className="w-6 h-6 text-white" />
                  ) : (
                    <PauseIcon className="w-6 h-6 text-white" />
                  )}
                </Button>
                
                <Button
                  onClick={handleStopRecording}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center border-2 border-white/20"
                  variant="ghost"
                >
                  <Square className="w-6 h-6 text-white" />
                </Button>
              </div>
              
              <div className="text-center">
                <div className={`text-white font-medium ${isPaused ? 'text-yellow-400' : ''}`}>
                  {isPaused ? 'Recording Paused' : 'Recording'}
                </div>
                <div className="text-white/80 text-sm font-mono">
                  {formatDuration(duration)}
                </div>
              </div>
            </div>
          )}

          {!isRecording && (
            <div className="text-center text-white/60 text-sm">
              Tap the microphone to start recording
            </div>
          )}
        </div>
      )}
    </div>
  );
}