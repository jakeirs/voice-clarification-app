'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { ImageViewerDialog } from './ImageViewerDialog';

interface ExamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const exampleImages = [
  {
    id: 'example1',
    url: '/examples/exampleApp1.jpg',
    title: 'Example App 1',
    description: 'Modern mobile app interface design'
  },
  {
    id: 'example2',
    url: '/examples/exampleApp2.jpg',
    title: 'Example App 2',
    description: 'Clean dashboard layout design'
  },
  {
    id: 'example3',
    url: '/examples/exampleApp3.jpg',
    title: 'Example App 3',
    description: 'E-commerce app interface design'
  }
];

export function ExamplesModal({ isOpen, onClose }: ExamplesModalProps) {
  const [selectedExample, setSelectedExample] = useState<{
    url: string;
    title: string;
    date: Date;
  } | null>(null);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl bg-black/90 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Example App Designs</DialogTitle>
            <p className="text-white/60 text-sm">
              Reference designs to inspire your UI generation
            </p>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            {exampleImages.map((example) => (
              <Card 
                key={example.id}
                className="glass-secondary p-3 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => {
                  setSelectedExample({
                    url: example.url,
                    title: example.title,
                    date: new Date()
                  });
                }}
              >
                <div className="aspect-square bg-white/5 rounded overflow-hidden mb-3">
                  <img
                    src={example.url}
                    alt={example.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-white font-medium text-sm mb-1">
                  {example.title}
                </h3>
                <p className="text-white/60 text-xs">
                  {example.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="text-xs text-white/40 text-center pb-2">
            Click on any example to view in full screen
          </div>
        </DialogContent>
      </Dialog>

      {/* Example Image Viewer */}
      {selectedExample && (
        <ImageViewerDialog
          isOpen={!!selectedExample}
          onClose={() => setSelectedExample(null)}
          imageUrl={selectedExample.url}
          imageTitle={selectedExample.title}
          imageDate={selectedExample.date}
        />
      )}
    </>
  );
}