'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { MarkdownViewer } from './MarkdownViewer';

interface PromptDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  promptTitle: string;
  promptPath?: string;
}

export function PromptDetails({ isOpen, onClose, promptTitle, promptPath }: PromptDetailsProps) {
  const [markdownContent, setMarkdownContent] = useState<string>('Loading...');
  const [isLoading, setIsLoading] = useState(false);

  const loadMarkdownContent = async () => {
    const cacheKey = `prompt-content-${promptTitle}`;
    
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

    // Fetch from API
    setIsLoading(true);
    try {
      const response = await fetch('/api/prompt-content');
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
    if (isOpen) {
      loadMarkdownContent();
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">{promptTitle}</SheetTitle>
          <SheetDescription className="text-white/60">
            {isLoading ? 'Loading prompt content...' : 'Prompt details and context information'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <MarkdownViewer 
            content={markdownContent}
            className="text-white prose prose-invert max-w-none"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}