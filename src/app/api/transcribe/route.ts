import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

// Configure Fal AI client with API key
fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Starting transcription request...');
    
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      console.error('❌ No audio file provided in request');
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log('📁 Audio file details:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size,
    });

    // Validate audio file
    if (audioFile.size === 0) {
      console.error('❌ Audio file is empty');
      return NextResponse.json(
        { error: 'Audio file is empty' },
        { status: 400 }
      );
    }

    if (audioFile.size > 50 * 1024 * 1024) { // 50MB limit
      console.error('❌ Audio file too large:', audioFile.size);
      return NextResponse.json(
        { error: 'Audio file too large (max 50MB)' },
        { status: 400 }
      );
    }

    // Check if the audio format is supported by Fal AI Whisper (mp3, mp4, mpeg, mpga, m4a, wav, webm)
    const supportedFormats = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/m4a', 'audio/webm'];
    const isSupported = supportedFormats.some(format => audioFile.type.includes(format.split('/')[1]));
    
    if (!isSupported) {
      console.warn('⚠️ Audio format may not be supported by Fal AI Whisper:', audioFile.type);
      // We'll still try to process it, but log a warning
    }

    // Convert audio file to blob for Fal AI storage
    console.log('🔄 Converting audio file to blob...');
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: audioFile.type || 'audio/wav' });
    
    console.log('📤 Uploading to Fal AI storage...');
    let audioUrl: string;
    
    try {
      audioUrl = await fal.storage.upload(audioBlob);
      console.log('✅ Upload successful, URL:', audioUrl);
    } catch (uploadError: unknown) {
      const error = uploadError as { message?: string; status?: number; body?: unknown; stack?: string };
      console.error('❌ Upload failed:', {
        message: error.message,
        status: error.status,
        body: error.body,
        stack: error.stack,
      });
      return NextResponse.json(
        { 
          error: 'Failed to upload audio file',
          details: error.message || 'Unknown upload error',
          uploadError: error.body || error.message || 'Unknown error'
        },
        { status: 500 }
      );
    }

    console.log('🤖 Calling Fal AI Whisper API...');
    let result: { data?: { text?: string } };
    
    try {
      result = await fal.subscribe('fal-ai/whisper', {
        input: {
          audio_url: audioUrl,
          task: 'transcribe',
          chunk_level: 'segment',
          version: '3',
        },
        logs: true,
        onQueueUpdate: (update) => {
          console.log('📊 Queue update:', update);
        },
      });
      console.log('✅ Transcription successful');
    } catch (transcriptionError: unknown) {
      const error = transcriptionError as { message?: string; status?: number; body?: unknown; stack?: string };
      console.error('❌ Transcription failed:', {
        message: error.message,
        status: error.status,
        body: error.body,
        stack: error.stack,
      });
      return NextResponse.json(
        { 
          error: 'Failed to transcribe audio',
          details: error.message || 'Unknown transcription error',
          transcriptionError: error.body || error.message || 'Unknown error',
          audioUrl: audioUrl, // Include the URL for debugging
        },
        { status: 500 }
      );
    }

    // Extract transcript from result (Whisper returns text field)
    const transcript = result?.data?.text || '';
    console.log('📝 Transcript result:', {
      hasOutput: !!transcript,
      outputLength: transcript.length,
      fullResult: result,
    });

    if (!transcript) {
      console.warn('⚠️ No transcript output received');
      return NextResponse.json(
        { 
          error: 'No transcript generated',
          details: 'The audio file was processed but no transcript was returned',
          fullResult: result,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      transcript,
      status: 'completed',
      duration: audioFile.size ? Math.round(audioFile.size / 16000) : undefined,
      audioUrl: audioUrl, // Include for debugging
    });
    
  } catch (error: unknown) {
    const err = error as { message?: string; name?: string; status?: number; body?: unknown; stack?: string };
    console.error('💥 Unexpected error in transcription:', {
      message: err.message,
      name: err.name,
      status: err.status,
      body: err.body,
      stack: err.stack,
      fullError: error,
    });
    
    return NextResponse.json(
      { 
        error: 'Unexpected error during transcription',
        details: err.message || 'Unknown error',
        errorType: err.name || 'Unknown',
        errorBody: err.body,
        fullError: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}