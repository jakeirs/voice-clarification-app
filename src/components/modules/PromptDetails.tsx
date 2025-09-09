'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { MarkdownViewer } from './MarkdownViewer';

interface PromptDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  promptTitle: string;
  promptPath?: string;
  directContent?: string;
  showCharacterCount?: boolean;
}

export function PromptDetails({ isOpen, onClose, promptTitle, promptPath, directContent, showCharacterCount }: PromptDetailsProps) {
  const [markdownContent, setMarkdownContent] = useState<string>('Loading...');
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const loadMarkdownContent = async () => {
    // If we have direct content, use it instead of loading from file
    if (directContent) {
      setMarkdownContent(directContent);
      return;
    }
    
    if (!promptPath) {
      setMarkdownContent('No file path provided');
      return;
    }

    // Extract filename from path (e.g., 'MASTER_PROMPTS/GENERATE_PRD.md' -> 'GENERATE_PRD.md')
    const filename = promptPath.split('/').pop() || promptPath;
    const cacheKey = `prompt-content-${filename}`;
    
    // First check localStorage
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        const isExpired = Date.now() - cachedData.timestamp > 60 * 60 * 1000; // 1 hour
        
        if (!isExpired) {
          setMarkdownContent(cachedData.content);
          return;
        }
      } catch (e) {
        // Invalid cached data, continue to fetch
      }
    }

    // Fetch from API with correct file parameter
    setIsLoading(true);
    try {
      const response = await fetch(`/api/prompt-content?file=${encodeURIComponent(filename)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const content = await response.text();
      setMarkdownContent(content);
      
      // Cache the content
      localStorage.setItem(cacheKey, JSON.stringify({
        content,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error loading prompt content:', error);
      setMarkdownContent(`# Error Loading Content

Sorry, we couldn't load the prompt content. Please try again later.

**Error:** ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && (promptPath || directContent)) {
      loadMarkdownContent();
    }
  }, [isOpen, promptPath, directContent]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <SheetTitle className="text-white">{promptTitle}</SheetTitle>
              <SheetDescription className="text-white/60">
                {isLoading ? 'Loading prompt content...' : directContent ? 'Generated content details' : 'Prompt details and context information'}
                {showCharacterCount && markdownContent && (
                  <div className="mt-1 text-white/50 text-xs">
                    {markdownContent.length} characters
                  </div>
                )}
              </SheetDescription>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 flex-1 overflow-y-auto">
          <MarkdownViewer 
            content={markdownContent}
            className="text-white prose prose-invert max-w-none"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}