'use client';

import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { VoiceRecording } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDuration, formatFileSize } from '@/lib/audioUtils';
import { 
  Play, 
  Pause, 
  Download, 
  Trash2, 
  FileAudio, 
  Clock, 
  HardDrive,
  Loader2 
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function RecordingsList() {
  const { recordings, deleteRecording } = useAppStore();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<{ [key: string]: number }>({});
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const handlePlayPause = (recording: VoiceRecording) => {
    const audio = audioRefs.current[recording.id];
    
    if (!audio) {
      const audioSrc = recording.audioUrl || (recording.audioBlob ? URL.createObjectURL(recording.audioBlob) : '');
      if (!audioSrc) return;
      
      const newAudio = new Audio(audioSrc);
      audioRefs.current[recording.id] = newAudio;
      
      newAudio.addEventListener('timeupdate', () => {
        setCurrentTime(prev => ({
          ...prev,
          [recording.id]: newAudio.currentTime
        }));
      });
      
      newAudio.addEventListener('ended', () => {
        setPlayingId(null);
        setCurrentTime(prev => ({
          ...prev,
          [recording.id]: 0
        }));
      });
      
      newAudio.play();
      setPlayingId(recording.id);
    } else {
      if (playingId === recording.id) {
        audio.pause();
        setPlayingId(null);
      } else {
        // Pause other audio if playing
        Object.values(audioRefs.current).forEach(a => a.pause());
        audio.play();
        setPlayingId(recording.id);
      }
    }
  };

  const handleDownload = (recording: VoiceRecording) => {
    const url = recording.audioUrl || (recording.audioBlob ? URL.createObjectURL(recording.audioBlob) : '');
    if (!url) return;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.title}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = (recordingId: string) => {
    // Stop audio if playing
    const audio = audioRefs.current[recordingId];
    if (audio) {
      audio.pause();
      delete audioRefs.current[recordingId];
    }
    
    if (playingId === recordingId) {
      setPlayingId(null);
    }
    
    deleteRecording(recordingId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-white/60';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Loader2 className="w-3 h-3 animate-spin" />;
      case 'error': return <div className="w-3 h-3 rounded-full bg-red-500" />;
      case 'completed': return <div className="w-3 h-3 rounded-full bg-green-500" />;
      default: return <div className="w-3 h-3 rounded-full bg-white/30" />;
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  return (
    <div className="space-y-4">
      {recordings.map((recording) => {
        const isPlaying = playingId === recording.id;
        const progress = recording.duration 
          ? ((currentTime[recording.id] || 0) / recording.duration) * 100 
          : 0;

        return (
          <Card key={recording.id} className="glass-secondary p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <FileAudio className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-white truncate">
                      {recording.title}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(recording.status)}
                      <span className={`text-xs ${getStatusColor(recording.status)}`}>
                        {recording.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-white/60">
                    {recording.duration && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDuration(recording.duration)}</span>
                      </div>
                    )}
                    {recording.fileSize && (
                      <div className="flex items-center space-x-1">
                        <HardDrive className="w-3 h-3" />
                        <span>{formatFileSize(recording.fileSize)}</span>
                      </div>
                    )}
                    <span>{recording.createdAt.toLocaleDateString()}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  {isPlaying && recording.duration && (
                    <div className="mt-2">
                      <div className="w-full bg-white/10 rounded-full h-1">
                        <div 
                          className="bg-blue-500 h-1 rounded-full transition-all duration-100"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-white/50 mt-1">
                        <span>{formatDuration(currentTime[recording.id] || 0)}</span>
                        <span>{formatDuration(recording.duration)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handlePlayPause(recording)}
                  className="w-8 h-8 p-0 bg-white/10 hover:bg-white/15"
                  disabled={recording.status !== 'completed'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white" />
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownload(recording)}
                  className="w-8 h-8 p-0 bg-white/10 hover:bg-white/15"
                  disabled={recording.status !== 'completed'}
                >
                  <Download className="w-4 h-4 text-white" />
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(recording.id)}
                  className="w-8 h-8 p-0 bg-white/10 hover:bg-red-500/20 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}