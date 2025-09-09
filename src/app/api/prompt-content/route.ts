import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get filename from query params
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file') || 'Description_of_app.md';
    
    // Security check: only allow .md files from MASTER_PROMPTS directory
    if (!filename.endsWith('.md') || filename.includes('..')) {
      return NextResponse.json(
        { error: 'Invalid file request' },
        { status: 400 }
      );
    }
    
    const filePath = join(process.cwd(), 'public', 'MASTER_PROMPTS', filename);
    const fileContent = readFileSync(filePath, 'utf8');
    
    console.log(`📄 Served prompt content: ${filename} (${fileContent.length} chars)`);
    
    return new Response(fileContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error reading markdown file:', error);
    return NextResponse.json(
      { error: 'Failed to load prompt content' },
      { status: 404 }
    );
  }
}