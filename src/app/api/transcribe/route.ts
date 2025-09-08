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
    } catch (uploadError: any) {
      console.error('❌ Upload failed:', {
        message: uploadError.message,
        status: uploadError.status,
        body: uploadError.body,
        stack: uploadError.stack,
      });
      return NextResponse.json(
        { 
          error: 'Failed to upload audio file',
          details: uploadError.message,
          uploadError: uploadError.body || uploadError.message
        },
        { status: 500 }
      );
    }

    console.log('🤖 Calling Fal AI Whisper API...');
    let result: any;
    
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
    } catch (transcriptionError: any) {
      console.error('❌ Transcription failed:', {
        message: transcriptionError.message,
        status: transcriptionError.status,
        body: transcriptionError.body,
        stack: transcriptionError.stack,
      });
      return NextResponse.json(
        { 
          error: 'Failed to transcribe audio',
          details: transcriptionError.message,
          transcriptionError: transcriptionError.body || transcriptionError.message,
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
    
  } catch (error: any) {
    console.error('💥 Unexpected error in transcription:', {
      message: error.message,
      name: error.name,
      status: error.status,
      body: error.body,
      stack: error.stack,
      fullError: error,
    });
    
    return NextResponse.json(
      { 
        error: 'Unexpected error during transcription',
        details: error.message,
        errorType: error.name,
        errorBody: error.body,
        fullError: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}