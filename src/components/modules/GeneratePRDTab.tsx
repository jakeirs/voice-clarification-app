'use client';

import { useState, useEffect } from 'react';
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
    savePRDToTranscript,
  } = useAppStore();
  
  const [promptDetailsOpen, setPromptDetailsOpen] = useState(false);
  const [promptDetailsConfig, setPromptDetailsConfig] = useState({
    title: '',
    path: ''
  });
  const [generatedPRD, setGeneratedPRD] = useState<string | null>(null);
  const [prdDetailsOpen, setPrdDetailsOpen] = useState(false);
  const [transcriptDetailsOpen, setTranscriptDetailsOpen] = useState(false);
  const [showGeneratedPRDPrompt, setShowGeneratedPRDPrompt] = useState(false);

  const handleShowPrompt = (title: string, path: string) => {
    setPromptDetailsConfig({ title, path });
    setPromptDetailsOpen(true);
  };

  const handleShowPRD = () => {
    setPrdDetailsOpen(true);
  };

  const handleShowTranscript = () => {
    setTranscriptDetailsOpen(true);
  };

  const handleShowGeneratedPRD = () => {
    setShowGeneratedPRDPrompt(true);
  };

  // Clear generated PRD state when activeTab changes away from generate-prd
  useEffect(() => {
    const { activeTab } = useAppStore.getState();
    if (activeTab !== 'generate-prd') {
      setGeneratedPRD(null);
      setShowGeneratedPRDPrompt(false);
    }
  }, []);

  // Subscribe to active tab changes
  useEffect(() => {
    const unsubscribe = useAppStore.subscribe(
      (state) => {
        if (state.activeTab !== 'generate-prd') {
          setGeneratedPRD(null);
          setShowGeneratedPRDPrompt(false);
        }
      }
    );
    
    return unsubscribe;
  }, []);

  const handleGeneratePRD = async () => {
    setIsGeneratingPRD(true);
    try {
      console.log('🚀 [PRD Generation] Starting prompt construction...');
      console.log('📋 [PRD Generation] Selected context cards:', selectedContextCards);
      
      // Build the structured prompt on frontend
      const structuredPrompt = await buildFrontendPrompt(selectedContextCards, transcript.text);
      
      console.log('📝 [PRD Generation] Constructed prompt:');
      console.log('─'.repeat(80));
      console.log(structuredPrompt);
      console.log('─'.repeat(80));
      console.log(`📊 [PRD Generation] Prompt stats: ${structuredPrompt.length} characters, ${structuredPrompt.split('\n').length} lines`);

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: structuredPrompt
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate PRD: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [PRD Generation] Response received:', {
        length: data.result?.length || 0,
        processingTime: data.processingTime
      });
      
      // Auto-save PRD to transcript
      savePRDToTranscript(transcript.id, data.result, selectedContextCards);
      setGeneratedPRD(data.result);
    } catch (error) {
      console.error('❌ [PRD Generation] Error:', error);
      // You might want to add error handling UI here
    } finally {
      setIsGeneratingPRD(false);
    }
  };

  // Frontend prompt construction function
  const buildFrontendPrompt = async (selectedCards: string[], transcriptText: string): Promise<string> => {
    console.log('🔍 [Prompt Builder] Starting with selected cards:', selectedCards);
    console.log('📝 [Prompt Builder] Transcript length:', transcriptText.length);
    
    let prompt = 'These are context:\n\n';
    let sectionsAdded = [];
    
    // App Description Section (conditional)
    if (selectedCards.includes('app-description')) {
      console.log('✅ [Prompt Builder] Processing app-description...');
      try {
        const response = await fetch('/api/prompt-content?file=Description_of_app.md');
        if (response.ok) {
          const content = await response.text();
          prompt += `<App-description>\n${content}\n</App-description>\n\n`;
          sectionsAdded.push('App Description');
          console.log('📄 [Prompt Builder] ✅ Added app description section (', content.length, 'chars)');
        } else {
          console.error('❌ [Prompt Builder] App description fetch failed:', response.status);
        }
      } catch (error) {
        console.warn('⚠️ [Prompt Builder] Failed to load app description:', error);
      }
    } else {
      console.log('⏭️ [Prompt Builder] Skipping app-description (not selected)');
    }

    // Raw Transcription Section (conditional)
    if (selectedCards.includes('raw-transcription')) {
      console.log('✅ [Prompt Builder] Processing raw-transcription...');
      prompt += `<Raw-transcription>\n${transcriptText}\n</Raw-transcription>\n\n`;
      sectionsAdded.push('Raw Transcription');
      console.log('📝 [Prompt Builder] ✅ Added raw transcription section (', transcriptText.length, 'chars)');
    } else {
      console.log('⏭️ [Prompt Builder] Skipping raw-transcription (not selected)');
    }

    // Ready PRD Section (conditional)
    if (selectedCards.includes('ready-prd')) {
      console.log('✅ [Prompt Builder] Processing ready-prd...');
      const transcript = useAppStore.getState().transcripts.find((t: Transcript) => t.id === useAppStore.getState().currentTranscript?.id);
      if (transcript?.generatedPRD) {
        prompt += `<PRD>\n${transcript.generatedPRD.content}\n</PRD>\n\n`;
        sectionsAdded.push('Ready PRD');
        console.log('📋 [Prompt Builder] ✅ Added ready PRD section (', transcript.generatedPRD.content.length, 'chars)');
      } else {
        console.warn('⚠️ [Prompt Builder] Ready PRD selected but no PRD found');
      }
    } else {
      console.log('⏭️ [Prompt Builder] Skipping ready-prd (not selected)');
    }

    // Master PRD Prompt (always included at the end)
    if (selectedCards.includes('master-prd-prompt')) {
      console.log('✅ [Prompt Builder] Processing master-prd-prompt...');
      try {
        const response = await fetch('/api/prompt-content?file=GENERATE_PRD.md');
        if (response.ok) {
          const content = await response.text();
          prompt += content;
          sectionsAdded.push('Master PRD Prompt');
          console.log('📋 [Prompt Builder] ✅ Added master PRD prompt section (', content.length, 'chars)');
        } else {
          console.error('❌ [Prompt Builder] Master PRD prompt fetch failed:', response.status);
        }
      } catch (error) {
        console.warn('⚠️ [Prompt Builder] Failed to load master PRD prompt:', error);
        prompt += 'Please generate a comprehensive Product Requirements Document (PRD) based on the provided context.';
        sectionsAdded.push('Fallback PRD Prompt');
      }
    } else {
      console.log('⏭️ [Prompt Builder] Skipping master-prd-prompt (not selected)');
    }

    console.log('🏁 [Prompt Builder] Final sections added:', sectionsAdded);
    console.log('📊 [Prompt Builder] Final prompt length:', prompt.length);
    return prompt;
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
            {/* Ready PRD Card - Only show if PRD exists */}
            {transcript.generatedPRD && (
              <ContextCard
                id="ready-prd"
                title="Ready PRD"
                description="Generated PRD for this transcript"
                cardType="prd"
                onShowPRD={handleShowPRD}
              />
            )}

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
              onShowPrompt={handleShowTranscript}
            />

            {/* Master Prompt Card */}
            <ContextCard
              id="master-prd-prompt"
              title="Master PRD Prompt"
              description="Product Requirements Document generation guidelines"
              onShowPrompt={() => handleShowPrompt('Master PRD Prompt', 'MASTER_PROMPTS/GENERATE_PRD.md')}
            />
          </div>

          {/* Generated Results Section */}
          {generatedPRD && (
            <div className="space-y-4">
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-lg font-medium text-white mb-2">Generated Results</h3>
                <p className="text-white/60 text-sm mb-4">
                  Results from your recent PRD generation.
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  <ContextCard
                    id="generated-prd-result"
                    title="Generated PRD"
                    description={`Generated ${new Date().toLocaleString()} • ${generatedPRD.length} characters`}
                    onShowPrompt={handleShowGeneratedPRD}
                  />
                </div>
              </div>
            </div>
          )}

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

      {/* PRD Details Sheet */}
      <PromptDetails
        isOpen={prdDetailsOpen}
        onClose={() => setPrdDetailsOpen(false)}
        promptTitle={`PRD: ${transcript.title}`}
        directContent={transcript.generatedPRD?.content || ''}
        showCharacterCount={true}
      />

      {/* Transcript Details Sheet */}
      <PromptDetails
        isOpen={transcriptDetailsOpen}
        onClose={() => setTranscriptDetailsOpen(false)}
        promptTitle={`Raw Transcript: ${transcript.title}`}
        directContent={transcript.text}
        showCharacterCount={true}
      />

      {/* Generated PRD Content Sheet */}
      <PromptDetails
        isOpen={showGeneratedPRDPrompt}
        onClose={() => setShowGeneratedPRDPrompt(false)}
        promptTitle="Generated PRD Content"
        directContent={generatedPRD || ''}
        showCharacterCount={true}
      />
    </>
  );
}