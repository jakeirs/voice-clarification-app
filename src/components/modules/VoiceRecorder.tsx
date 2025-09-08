'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { Button } from '@/components/ui/button';
import { VoiceRecording } from '@/types';
import { generateRecordingId, formatDuration } from '@/lib/audioUtils';
import { Mic, Square, Play, Pause } from 'lucide-react';

export function VoiceRecorder() {
  const { 
    isRecording, 
    startRecording, 
    stopRecording, 
    addRecording, 
    setError 
  } = useAppStore();
  
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      
      startRecording();
      setDuration(0);
      startTimer();
      setError(null);
      
    } catch (error) {
      setError('Failed to access microphone. Please check permissions.');
      console.error('Recording error:', error);
    }
  }, [startRecording, startTimer, setError]);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      stopRecording();
      stopTimer();
    }
  }, [isRecording, stopRecording, stopTimer]);

  const handleSaveRecording = useCallback(() => {
    if (recordedBlob && duration > 0) {
      const recording: VoiceRecording = {
        id: generateRecordingId(),
        title: `Recording ${new Date().toLocaleString()}`,
        audioBlob: recordedBlob,
        audioUrl: URL.createObjectURL(recordedBlob),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'completed',
        duration: duration,
        fileSize: recordedBlob.size,
      };
      
      addRecording(recording);
      
      // Reset state
      setRecordedBlob(null);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [recordedBlob, duration, addRecording]);

  const handlePlayPause = useCallback(() => {
    if (!recordedBlob || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying, recordedBlob]);

  useEffect(() => {
    if (recordedBlob && !audioRef.current) {
      audioRef.current = new Audio(URL.createObjectURL(recordedBlob));
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [recordedBlob]);

  useEffect(() => {
    return () => {
      stopTimer();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [stopTimer]);

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <div className="flex flex-col items-center space-y-4">
        {!isRecording && !recordedBlob && (
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
            <Button
              onClick={handleStopRecording}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center animate-pulse border-2 border-white/20"
              variant="ghost"
            >
              <Square className="w-6 h-6 text-white" />
            </Button>
            <div className="text-white/80 text-sm font-mono">
              Recording: {formatDuration(duration)}
            </div>
          </div>
        )}

        {recordedBlob && !isRecording && (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handlePlayPause}
                className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
                variant="ghost"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-1" />
                )}
              </Button>
              <div className="text-white/80 text-sm font-mono">
                {formatDuration(duration)}
              </div>
            </div>
            
            <div className="flex space-x-2 w-full">
              <Button
                onClick={() => {
                  setRecordedBlob(null);
                  setDuration(0);
                  setIsPlaying(false);
                }}
                variant="outline"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/15"
              >
                Discard
              </Button>
              <Button
                onClick={handleSaveRecording}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      {!isRecording && !recordedBlob && (
        <div className="text-center text-white/60 text-sm">
          Tap the microphone to start recording
        </div>
      )}
    </div>
  );
}