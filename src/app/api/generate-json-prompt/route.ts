import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildUIDesignPrompt, PromptContextData } from '@/lib/promptBuilder';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  console.log('🧠 Generate JSON Prompt API - Request received');

  try {
    // Parse form data
    const formData = await request.formData();
    const contextDataStr = formData.get('contextData') as string;
    
    if (!contextDataStr) {
      return NextResponse.json(
        { error: 'No context data provided' },
        { status: 400 }
      );
    }

    const contextData = JSON.parse(contextDataStr);
    console.log('📄 Context data:', {
      selectedCards: contextData.selectedCards,
      transcriptLength: contextData.transcript?.length || 0,
      imagesCount: contextData.uploadedImagesCount
    });

    // Process uploaded images
    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File) {
        imageFiles.push(value);
      }
    }

    console.log(`🖼️  Processing ${imageFiles.length} uploaded images`);

    // Prepare context data for prompt builder
    const promptContextData: PromptContextData = {
      selectedCards: contextData.selectedCards,
      transcript: contextData.transcript,
      uploadedImages: imageFiles,
      transcripts: contextData.transcripts || []
    };

    console.log('🏗️  Building structured UI design prompt...');

    // Prepare images for Gemini (convert to base64)
    const imageData = [];
    for (const imageFile of imageFiles) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      imageData.push({
        inlineData: {
          data: base64,
          mimeType: imageFile.type
        }
      });
    }

    // Build structured prompt using prompt builder
    const structuredPrompt = await buildUIDesignPrompt(promptContextData);
    
    console.log('📄 Structured prompt created:', {
      promptLength: structuredPrompt.length,
      sectionsIncluded: contextData.selectedCards.length
    });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Prepare the content array - Gemini expects a specific format
    let content;
    
    if (imageData.length > 0) {
      // For multimodal content with images
      content = [
        { text: structuredPrompt },
        ...imageData,
        { text: "Use these reference images as inspiration for the design style, color palette, and layout structure." }
      ];
    } else {
      // Text-only content
      content = structuredPrompt;
    }

    console.log('🤖 Calling Gemini API for JSON prompt generation...');

    const result = await model.generateContent(content);
    const response = result.response;
    const jsonPrompt = response.text();
    
    console.log('📊 Generated prompt preview:', {
      structuredPromptLength: structuredPrompt.length,
      generatedJSONLength: jsonPrompt.length
    });

    const processingTime = Date.now() - startTime;
    console.log(`✅ JSON prompt generated successfully in ${processingTime}ms`);
    console.log(`📊 Generated prompt length: ${jsonPrompt.length} characters`);

    return NextResponse.json({
      success: true,
      jsonPrompt,
      metadata: {
        processingTime,
        contextCardsUsed: contextData.selectedCards.length,
        imagesProcessed: imageFiles.length,
        promptLength: jsonPrompt.length
      }
    });

  } catch (error) {
    console.error('❌ Generate JSON Prompt API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate JSON prompt', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}