import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

// Configure fal client with API key
fal.config({
  credentials: process.env.FAL_KEY,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  console.log('🎨 Generate Design API - Request received');

  try {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const numImagesStr = formData.get('numImages') as string;

    if (!prompt) {
      return NextResponse.json(
        { error: 'No prompt provided' },
        { status: 400 }
      );
    }

    const numImages = parseInt(numImagesStr) || 1;
    
    console.log('📋 Design generation request:', {
      promptLength: prompt.length,
      numImages: numImages
    });

    // Process reference images
    const referenceImages: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('reference_') && value instanceof File) {
        console.log(`🖼️  Processing reference image: ${value.name}`);
        
        // Convert file to base64 data URL
        const arrayBuffer = await value.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const mimeType = value.type;
        const dataUrl = `data:${mimeType};base64,${base64}`;
        
        referenceImages.push(dataUrl);
      }
    }

    console.log(`🖼️  Processed ${referenceImages.length} reference images`);

    // Enhanced prompt for UI design generation
    const designPrompt = `${prompt}

Create a modern, clean UI design mockup. Focus on:
- Professional and polished appearance
- Clear visual hierarchy
- Modern design trends
- Appropriate use of whitespace
- Consistent styling
- Mobile-responsive layout considerations
- Accessible color contrasts
- Clean typography

Style: Modern UI/UX design mockup, high-fidelity, professional app interface`;

    console.log('🎨 Calling Fal AI for design generation...');

    // Use a model more suitable for UI/UX design generation
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: designPrompt,
        image_size: "landscape_16_9", // Good aspect ratio for UI mockups
        num_images: numImages,
        enable_safety_checker: true,
        sync_mode: false
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log('🔄 Fal AI processing update:', update.logs?.map(log => log.message) || []);
        }
      },
    });

    const processingTime = Date.now() - startTime;
    
    console.log('✅ Design generation completed:', {
      processingTime: `${processingTime}ms`,
      imagesGenerated: result.data.images?.length || 0,
      requestId: result.requestId
    });

    // Validate that we received images
    if (!result.data.images || result.data.images.length === 0) {
      throw new Error('No images were generated');
    }

    return NextResponse.json({
      success: true,
      data: {
        images: result.data.images.map((img: any) => img.url || img),
        metadata: {
          processingTime,
          numImagesRequested: numImages,
          numImagesGenerated: result.data.images.length,
          referenceImagesUsed: referenceImages.length,
          requestId: result.requestId,
          promptLength: prompt.length
        }
      }
    });

  } catch (error) {
    console.error('❌ Design generation API error:', error);
    
    // Enhanced error handling for different types of errors
    let errorMessage = 'Failed to generate designs';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = 'API quota exceeded. Please try again later.';
        statusCode = 429;
      } else if (error.message.includes('invalid') || error.message.includes('malformed')) {
        errorMessage = 'Invalid request data. Please check your inputs.';
        statusCode = 400;
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}