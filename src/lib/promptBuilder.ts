import fs from 'fs/promises';
import path from 'path';

export interface PromptContextData {
  selectedCards: string[];
  transcript?: string;
  prdContent?: string;
  uploadedImages?: File[];
  transcripts?: any[]; // For accessing other transcripts/PRDs
}

export interface StructuredPromptOptions {
  contextData: PromptContextData;
  masterPromptPath: string; // Path to the master prompt file
  includeImageReferences?: boolean;
}

/**
 * Builds a structured markdown prompt with conditional XML-like sections
 */
export async function buildStructuredPrompt(options: StructuredPromptOptions): Promise<string> {
  const { contextData, masterPromptPath, includeImageReferences = true } = options;
  const { selectedCards, transcript, uploadedImages = [], transcripts = [] } = contextData;

  let structuredPrompt = 'These are context:\n\n';

  // App Description Section (conditional)
  if (selectedCards.includes('app-description')) {
    try {
      const appDescPath = path.join(process.cwd(), 'public', 'MASTER_PROMPTS', 'Description_of_app.md');
      const appDescContent = await fs.readFile(appDescPath, 'utf-8');
      structuredPrompt += `<App-description>\n${appDescContent}\n</App-description>\n\n`;
    } catch (error) {
      console.error('Error loading app description:', error);
    }
  }

  // Raw Transcription Section (conditional)
  if (selectedCards.includes('raw-transcription') && transcript) {
    structuredPrompt += `<Raw-transcription>\n${transcript}\n</Raw-transcription>\n\n`;
  }

  // PRD Section (conditional)
  const selectedPrd = selectedCards.find(card => card.startsWith('prd-'));
  if (selectedPrd) {
    const prdId = selectedPrd.replace('prd-', '');
    const prdTranscript = transcripts.find(t => t.id === prdId);
    
    if (prdTranscript) {
      structuredPrompt += `<PRD>\n${prdTranscript.text}\n</PRD>\n\n`;
    } else if (contextData.prdContent) {
      structuredPrompt += `<PRD>\n${contextData.prdContent}\n</PRD>\n\n`;
    }
  }

  // Image References Section (conditional)
  if (includeImageReferences && selectedCards.includes('image-references') && uploadedImages.length > 0) {
    const imageFilenames = uploadedImages.map(img => img.name).join(', ');
    structuredPrompt += `<Provided-image-references>\n${imageFilenames}\n</Provided-image-references>\n\n`;
  }

  // Master Prompt (always included at the end)
  try {
    const masterPromptFullPath = path.join(process.cwd(), 'public', 'MASTER_PROMPTS', masterPromptPath);
    const masterPromptContent = await fs.readFile(masterPromptFullPath, 'utf-8');
    structuredPrompt += masterPromptContent;
  } catch (error) {
    console.error('Error loading master prompt:', error);
    structuredPrompt += `Error loading master prompt from: ${masterPromptPath}`;
  }

  return structuredPrompt;
}

/**
 * Builds a structured prompt specifically for UI Design generation
 */
export async function buildUIDesignPrompt(contextData: PromptContextData): Promise<string> {
  return buildStructuredPrompt({
    contextData,
    masterPromptPath: 'GEN_DESIGN.md',
    includeImageReferences: true
  });
}

/**
 * Builds a structured prompt specifically for PRD generation
 */
export async function buildPRDPrompt(contextData: PromptContextData): Promise<string> {
  return buildStructuredPrompt({
    contextData,
    masterPromptPath: 'GENERATE_PRD.md',
    includeImageReferences: false // PRDs typically don't need image references
  });
}

/**
 * Client-side version for building prompts without file system access
 * Used when context content is already loaded
 */
export interface ClientPromptData {
  appDescription?: string;
  rawTranscription?: string;
  prdContent?: string;
  imageFilenames?: string[];
  masterPrompt: string;
}

export function buildClientStructuredPrompt(
  selectedCards: string[], 
  data: ClientPromptData
): string {
  let structuredPrompt = 'These are context:\n\n';

  // App Description Section (conditional)
  if (selectedCards.includes('app-description') && data.appDescription) {
    structuredPrompt += `<App-description>\n${data.appDescription}\n</App-description>\n\n`;
  }

  // Raw Transcription Section (conditional)
  if (selectedCards.includes('raw-transcription') && data.rawTranscription) {
    structuredPrompt += `<Raw-transcription>\n${data.rawTranscription}\n</Raw-transcription>\n\n`;
  }

  // PRD Section (conditional)
  const selectedPrd = selectedCards.find(card => card.startsWith('prd-'));
  if (selectedPrd && data.prdContent) {
    structuredPrompt += `<PRD>\n${data.prdContent}\n</PRD>\n\n`;
  }

  // Image References Section (conditional)
  if (selectedCards.includes('image-references') && data.imageFilenames && data.imageFilenames.length > 0) {
    const imageList = data.imageFilenames.join(', ');
    structuredPrompt += `<Provided-image-references>\n${imageList}\n</Provided-image-references>\n\n`;
  }

  // Master Prompt (always included at the end)
  structuredPrompt += data.masterPrompt;

  return structuredPrompt;
}