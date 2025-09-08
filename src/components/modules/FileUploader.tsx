'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { VoiceRecording } from '@/types';
import { generateRecordingId, isAudioFile, getAudioDuration, formatFileSize } from '@/lib/audioUtils';
import { Upload, FileAudio, AlertCircle } from 'lucide-react';

export function FileUploader() {
  const { addRecording, setError, clearError } = useAppStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    clearError();
    
    for (const file of acceptedFiles) {
      if (!isAudioFile(file)) {
        setError(`${file.name} is not a supported audio file format.`);
        continue;
      }

      try {
        const duration = await getAudioDuration(file);
        const audioUrl = URL.createObjectURL(file);
        
        const recording: VoiceRecording = {
          id: generateRecordingId(),
          title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          audioUrl: audioUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'completed',
          duration: duration,
          fileSize: file.size,
        };
        
        addRecording(recording);
        
      } catch (error) {
        setError(`Failed to process ${file.name}. Please try again.`);
        console.error('File processing error:', error);
      }
    }
  }, [addRecording, setError, clearError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.webm', '.flac', '.aac']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB limit
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragActive && !isDragReject 
            ? 'border-blue-400 bg-blue-500/10' 
            : isDragReject
            ? 'border-red-400 bg-red-500/10'
            : 'border-white/30 hover:border-white/50 hover:bg-white/5'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-3">
          {isDragReject ? (
            <AlertCircle className="w-8 h-8 text-red-400" />
          ) : isDragActive ? (
            <Upload className="w-8 h-8 text-blue-400 animate-bounce" />
          ) : (
            <FileAudio className="w-8 h-8 text-white/60" />
          )}
          
          <div className="space-y-1">
            {isDragReject ? (
              <p className="text-red-400 text-sm font-medium">
                Unsupported file type
              </p>
            ) : isDragActive ? (
              <p className="text-blue-400 text-sm font-medium">
                Drop your audio files here
              </p>
            ) : (
              <>
                <p className="text-white text-sm font-medium">
                  Drop audio files here or click to browse
                </p>
                <p className="text-white/60 text-xs">
                  Supports MP3, WAV, M4A, OGG, WebM, FLAC, AAC
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-xs text-white/50 text-center">
        Maximum file size: 50MB per file
      </div>
    </div>
  );
}