'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { ContextCard } from './ContextCard';
import { ImageReferencesCard } from './ImageReferencesCard';
import { PromptDetails } from './PromptDetails';
import { ImageViewerDialog } from './ImageViewerDialog';
import { ExamplesModal } from './ExamplesModal';
import { Transcript } from '@/types';
import { 
  Sparkles, 
  Copy, 
  Loader2,
  Palette,
  FileText,
  Image as ImageIcon,
  Download
} from 'lucide-react';

interface UIDesignsTabProps {
  transcript: Transcript;
}

export function UIDesignsTab({ transcript }: UIDesignsTabProps) {
  const { 
    selectedContextCards,
    uploadedImages,
    generatedJsonPrompt,
    generatedDesigns,
    designGenerationCount,
    isGeneratingJson,
    isGeneratingDesigns,
    setGeneratedJsonPrompt,
    addGeneratedDesign,
    setDesignGenerationCount,
    setIsGeneratingJson,
    setIsGeneratingDesigns,
    transcripts
  } = useAppStore();
  
  const [promptDetailsOpen, setPromptDetailsOpen] = useState(false);
  const [promptDetailsConfig, setPromptDetailsConfig] = useState({
    title: '',
    path: ''
  });
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    date: Date;
  } | null>(null);
  
  // Get completed transcripts (PRDs) for selection
  const completedTranscripts = transcripts.filter(t => t.status === 'completed' && t.id !== transcript.id);

  const handleShowPrompt = (title: string, path: string) => {
    setPromptDetailsConfig({ title, path });
    setPromptDetailsOpen(true);
  };

  const handleShowExamples = () => {
    setExamplesOpen(true);
  };

  const handleGenerateJsonPrompt = async () => {
    setIsGeneratingJson(true);
    try {
      // Prepare context data for structured prompt
      const contextData = {
        selectedCards: selectedContextCards,
        transcript: transcript.text,
        uploadedImagesCount: uploadedImages.length,
        transcripts: transcripts // Pass all transcripts for PRD access
      };

      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('contextData', JSON.stringify(contextData));
      
      uploadedImages.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      console.log('🏗️  Sending structured prompt request to generate-json-prompt API');

      const response = await fetch('/api/generate-json-prompt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to generate JSON prompt: ${response.statusText}`);
      }

      const data = await response.json();
      setGeneratedJsonPrompt(data.jsonPrompt);
      
      console.log('✅ Structured JSON prompt generated successfully', {
        length: data.jsonPrompt?.length,
        metadata: data.metadata
      });
    } catch (error) {
      console.error('❌ Error generating JSON prompt:', error);
      // You might want to add error handling UI here
    } finally {
      setIsGeneratingJson(false);
    }
  };

  const handleCopyJsonPrompt = async () => {
    if (generatedJsonPrompt) {
      try {
        await navigator.clipboard.writeText(generatedJsonPrompt);
        // You might want to add a toast notification here
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  const handleGenerateDesigns = async () => {
    if (!generatedJsonPrompt) return;
    
    setIsGeneratingDesigns(true);
    try {
      // Create FormData for the design generation
      const formData = new FormData();
      formData.append('prompt', generatedJsonPrompt);
      formData.append('numImages', designGenerationCount.toString());
      
      uploadedImages.forEach((image, index) => {
        formData.append(`reference_${index}`, image);
      });

      const response = await fetch('/api/generate-design', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to generate designs: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Add generated designs to store
      if (data.data.images) {
        data.data.images.forEach((imageUrl: string, index: number) => {
          addGeneratedDesign({
            id: `${Date.now()}_${index}`,
            url: imageUrl,
            prompt: generatedJsonPrompt,
            createdAt: new Date()
          });
        });
      }
    } catch (error) {
      console.error('Error generating designs:', error);
      // You might want to add error handling UI here
    } finally {
      setIsGeneratingDesigns(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Context Selection</h3>
          <p className="text-white/60 text-sm">
            Select context cards and upload reference images for UI design generation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* App Description Card */}
            <ContextCard
              id="app-description"
              title="App Description"
              description="Complete application description and requirements"
              onShowPrompt={() => handleShowPrompt('App Description', 'MASTER_PROMPTS/Description_of_app.md')}
            />

            {/* Master Design Prompt Card */}
            <ContextCard
              id="master-design-prompt"
              title="Master Design Prompt"
              description="UI/UX design generation guidelines and best practices"
              onShowPrompt={() => handleShowPrompt('Master Design Prompt', 'MASTER_PROMPTS/GEN_DESIGN.md')}
            />

            {/* PRD Selection Cards */}
            {completedTranscripts.length > 0 && (
              <>
                {completedTranscripts.slice(0, 2).map((prd) => (
                  <ContextCard
                    key={`prd-${prd.id}`}
                    id={`prd-${prd.id}`}
                    title={prd.title}
                    description={`Generated PRD: ${prd.text.substring(0, 80)}...`}
                    onShowPrompt={() => {
                      // For PRDs, we'll show the content directly instead of loading from file
                      // You might want to create a different modal for this
                    }}
                  />
                ))}
              </>
            )}

            {/* Image References Card */}
            <ImageReferencesCard
              id="image-references"
              title="Image References"
              description="Upload reference images for design inspiration"
              onShowExamples={handleShowExamples}
            />
          </div>

          {/* Generate JSON Prompt Section */}
          <div className="pt-4 border-t border-white/10">
            <Button 
              onClick={handleGenerateJsonPrompt}
              disabled={isGeneratingJson || selectedContextCards.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isGeneratingJson ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating JSON Prompt...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate JSON Prompt
                </>
              )}
            </Button>
          </div>

          {/* Generated JSON Prompt Display */}
          {generatedJsonPrompt && (
            <Card className="glass-secondary p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-400" />
                  <h4 className="text-white font-medium">Generated JSON Prompt</h4>
                  <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                    {generatedJsonPrompt.length} characters
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyJsonPrompt}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="bg-white/5 border border-white/10 rounded p-3 max-h-48 overflow-y-auto">
                <pre className="text-white/80 text-sm whitespace-pre-wrap">
                  {generatedJsonPrompt}
                </pre>
              </div>
            </Card>
          )}

          {/* Generate Design Section */}
          {generatedJsonPrompt && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h4 className="text-white font-medium">Generate UI Designs</h4>
              
              {/* Design Count Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-white/80">Number of design variations</label>
                  <span className="text-sm text-white font-medium">{designGenerationCount}</span>
                </div>
                <Slider
                  value={[designGenerationCount]}
                  onValueChange={([value]) => setDesignGenerationCount(value)}
                  max={3}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <Button 
                onClick={handleGenerateDesigns}
                disabled={isGeneratingDesigns}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
              >
                {isGeneratingDesigns ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Designs...
                  </>
                ) : (
                  <>
                    <Palette className="w-4 h-4 mr-2" />
                    Generate {designGenerationCount} Design{designGenerationCount > 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Generated Designs Display */}
          {generatedDesigns.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h4 className="text-white font-medium flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Generated Designs ({generatedDesigns.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {generatedDesigns.map((design) => (
                  <Card key={design.id} className="glass-secondary p-2 cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="aspect-square bg-white/5 rounded overflow-hidden mb-2">
                      <img
                        src={design.url}
                        alt={`Design ${design.id}`}
                        className="w-full h-full object-cover"
                        onClick={() => {
                          setSelectedImage({
                            url: design.url,
                            title: `UI Design ${design.id}`,
                            date: design.createdAt
                          });
                        }}
                      />
                    </div>
                    <p className="text-xs text-white/60 text-center">
                      {new Date(design.createdAt).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
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

      {/* Image Viewer Dialog */}
      {selectedImage && (
        <ImageViewerDialog
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          imageTitle={selectedImage.title}
          imageDate={selectedImage.date}
        />
      )}

      {/* Examples Modal */}
      <ExamplesModal 
        isOpen={examplesOpen} 
        onClose={() => setExamplesOpen(false)} 
      />
    </>
  );
}