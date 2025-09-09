import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting Gemini API request...');
    
    // Check if API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('❌ Google Generative AI API key not configured');
      return NextResponse.json(
        { error: 'Google Generative AI API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt, test = false } = body;
    
    if (!prompt && !test) {
      console.error('❌ No prompt provided in request');
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('📝 Request details:', {
      isTest: test,
      promptLength: prompt?.length || 0,
      hasPrompt: !!prompt,
    });

    // For connectivity test, use a simple prompt
    const testPrompt = test ? 'Say "Hello! Gemini API is working correctly."' : prompt;
    
    console.log('🧠 Initializing Gemini 2.5 Pro model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    
    console.log('📡 Sending request to Gemini API...');
    const startTime = Date.now();
    
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();
    
    const processingTime = Date.now() - startTime;
    
    console.log('✅ Gemini API request successful', {
      responseLength: text.length,
      processingTime: `${processingTime}ms`,
      hasResponse: !!text,
    });

    if (!text) {
      console.warn('⚠️ No response text received from Gemini');
      return NextResponse.json(
        { 
          error: 'No response generated',
          details: 'Gemini API returned empty response',
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      response: text,
      model: 'gemini-2.5-pro',
      processingTime,
      status: 'completed',
      isTest: test,
    });
    
  } catch (error: unknown) {
    const err = error as { message?: string; name?: string; status?: number; stack?: string };
    console.error('💥 Gemini API error:', {
      message: err.message,
      name: err.name,
      status: err.status,
      stack: err.stack,
      fullError: error,
    });
    
    // Handle specific Google API errors
    if (err.message?.includes('API_KEY_INVALID') || err.message?.includes('API key')) {
      return NextResponse.json(
        { 
          error: 'Invalid API key',
          details: 'Please check your Google Generative AI API key configuration',
        },
        { status: 401 }
      );
    }

    if (err.message?.includes('quota') || err.message?.includes('QUOTA')) {
      return NextResponse.json(
        { 
          error: 'API quota exceeded',
          details: 'Google Generative AI API quota has been exceeded',
        },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Gemini API request failed',
        details: err.message || 'Unknown error occurred',
        errorType: err.name || 'Unknown',
        fullError: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}

// GET endpoint for connectivity test
export async function GET() {
  try {
    console.log('🔍 Gemini API connectivity test...');
    
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Google Generative AI API key not configured',
          configured: false,
        },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    const startTime = Date.now();
    
    const result = await model.generateContent('Respond with exactly: "Connectivity test successful"');
    const response = await result.response;
    const text = response.text();
    
    const processingTime = Date.now() - startTime;
    
    console.log('✅ Connectivity test passed');
    
    return NextResponse.json({
      status: 'connected',
      message: 'Gemini API is working correctly',
      model: 'gemini-2.5-pro',
      processingTime,
      response: text,
      configured: true,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('❌ Connectivity test failed:', err.message);
    
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Gemini API connectivity test failed',
        details: err.message || 'Unknown error',
        configured: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      },
      { status: 500 }
    );
  }
}