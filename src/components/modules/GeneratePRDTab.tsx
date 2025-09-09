'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { ContextCard } from './ContextCard';
import { PromptDetails } from './PromptDetails';
import { Transcript } from '@/types';
import { 
  Sparkles, 
  Copy, 
  Loader2,
  FileText,
  MessageSquare
} from 'lucide-react';

interface GeneratePRDTabProps {
  transcript: Transcript;
}

export function GeneratePRDTab({ transcript }: GeneratePRDTabProps) {
  const { 
    selectedContextCards,
    isGeneratingJson: isGeneratingPRD,
    setIsGeneratingJson: setIsGeneratingPRD,
  } = useAppStore();
  
  const [promptDetailsOpen, setPromptDetailsOpen] = useState(false);
  const [promptDetailsConfig, setPromptDetailsConfig] = useState({
    title: '',
    path: ''
  });
  const [generatedPRD, setGeneratedPRD] = useState<string | null>(null);

  const handleShowPrompt = (title: string, path: string) => {
    setPromptDetailsConfig({ title, path });
    setPromptDetailsOpen(true);
  };

  const handleGeneratePRD = async () => {
    setIsGeneratingPRD(true);
    try {
      // Prepare context data for structured prompt
      const contextData = {
        selectedCards: selectedContextCards,
        transcript: transcript.text,
        transcriptId: transcript.id
      };

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contextData,
          useStructuredPrompt: true
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate PRD: ${response.statusText}`);
      }

      const data = await response.json();
      setGeneratedPRD(data.result);
    } catch (error) {
      console.error('Error generating PRD:', error);
      // You might want to add error handling UI here
    } finally {
      setIsGeneratingPRD(false);
    }
  };

  const handleCopyPRD = async () => {
    if (generatedPRD) {
      try {
        await navigator.clipboard.writeText(generatedPRD);
        // You might want to add a toast notification here
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  const handleSaveAsPRD = () => {
    if (generatedPRD) {
      // Create a new transcript with the generated PRD
      const newTranscript: Transcript = {
        id: `prd-${Date.now()}`,
        title: `PRD: ${transcript.title}`,
        text: generatedPRD,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'completed'
      };
      
      // Add to store
      const { addTranscript } = useAppStore.getState();
      addTranscript(newTranscript);
      
      // Clear generated PRD
      setGeneratedPRD(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Context Selection</h3>
          <p className="text-white/60 text-sm">
            Select context cards to include with your transcript for PRD generation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* App Description Card */}
            <ContextCard
              id="app-description"
              title="App Description"
              description="Complete application description and requirements"
              onShowPrompt={() => handleShowPrompt('App Description', 'MASTER_PROMPTS/Description_of_app.md')}
            />

            {/* Raw Transcription Card */}
            <ContextCard
              id="raw-transcription"
              title="Raw Transcription"
              description="Current transcript content for context"
              onShowPrompt={() => {
                // For raw transcription, we can show it in a simple modal
                // or create a specialized viewer
              }}
            />

            {/* Master Prompt Card */}
            <ContextCard
              id="master-prd-prompt"
              title="Master PRD Prompt"
              description="Product Requirements Document generation guidelines"
              onShowPrompt={() => handleShowPrompt('Master PRD Prompt', 'MASTER_PROMPTS/GENERATE_PRD.md')}
            />
          </div>

          {/* Generate PRD Section */}
          <div className="pt-4 border-t border-white/10">
            <Button 
              onClick={handleGeneratePRD}
              disabled={isGeneratingPRD || selectedContextCards.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isGeneratingPRD ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating PRD...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate PRD
                </>
              )}
            </Button>
          </div>

          {/* Generated PRD Display */}
          {generatedPRD && (
            <Card className="glass-secondary p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-400" />
                  <h4 className="text-white font-medium">Generated PRD</h4>
                  <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                    {generatedPRD.length} characters
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyPRD}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveAsPRD}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Save as PRD
                  </Button>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded p-3 max-h-96 overflow-y-auto">
                <div className="text-white/80 text-sm whitespace-pre-wrap">
                  {generatedPRD}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Nested Prompt Details Sheet */}
      <PromptDetails
        isOpen={promptDetailsOpen}
        onClose={() => setPromptDetailsOpen(false)}
        promptTitle={promptDetailsConfig.title}
        promptPath={promptDetailsConfig.path}
      />
    </>
  );
}