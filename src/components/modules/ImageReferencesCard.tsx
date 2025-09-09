'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { ImageUploadSheet } from './ImageUploadSheet';
import { 
  Upload, 
  Image as ImageIcon, 
  MoreVertical,
  Download,
  Check,
  Plus
} from 'lucide-react';

interface ImageReferencesCardProps {
  id: string;
  title: string;
  description?: string;
  onShowExamples?: () => void;
}

export function ImageReferencesCard({ 
  id, 
  title, 
  description, 
  onShowExamples 
}: ImageReferencesCardProps) {
  const { 
    selectedContextCards, 
    toggleContextCard, 
    uploadedImages
  } = useAppStore();
  
  const isSelected = selectedContextCards.includes(id);
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);

  const handleToggle = () => {
    toggleContextCard(id);
  };

  const handleOpenUploadSheet = (event: React.MouseEvent) => {
    event.stopPropagation();
    setUploadSheetOpen(true);
  };

  return (
    <Card 
      className={`glass-secondary p-4 cursor-pointer transition-all hover:bg-white/5 relative ${
        isSelected ? 'ring-2 ring-blue-400/50 bg-blue-500/10' : ''
      }`}
      onClick={handleToggle}
    >
      {/* Three dots menu */}
      <div className="absolute top-3 right-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3 w-3 text-white/60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black/90 border-white/20">
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onShowExamples?.();
              }}
              className="text-white hover:bg-white/10"
            >
              <Download className="w-3 h-3 mr-2" />
              Show Examples
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3 pr-6">
        {/* Icon and Title */}
        <div className="flex items-start space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isSelected ? 'bg-blue-500' : 'bg-white/10'
          }`}>
            {isSelected ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <ImageIcon className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm mb-1">
              {title}
            </h3>
            {description && (
              <p className="text-white/60 text-xs leading-relaxed mb-2">
                {description}
              </p>
            )}
            
            {/* Upload count indicator */}
            <p className="text-white/40 text-xs">
              {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} uploaded
            </p>
          </div>
        </div>

        {/* Image Upload Section */}
        {uploadedImages.length > 0 ? (
          /* Show thumbnails when images are uploaded */
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {uploadedImages.slice(0, 5).map((file, index) => (
                <div key={index} className="aspect-square bg-white/5 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {uploadedImages.length > 5 && (
                <div className="aspect-square bg-white/5 rounded-lg flex items-center justify-center">
                  <span className="text-white/60 text-xs font-medium">
                    +{uploadedImages.length - 5}
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenUploadSheet}
              className="w-full text-white/60 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add More Images
            </Button>
          </div>
        ) : (
          /* Show upload button when no images */
          <Button
            variant="ghost"
            onClick={handleOpenUploadSheet}
            className="w-full border-2 border-dashed border-white/20 hover:border-white/30 hover:bg-white/5 p-4 h-auto"
          >
            <div className="text-center space-y-2">
              <Upload className="w-6 h-6 text-white/60 mx-auto" />
              <div>
                <p className="text-white/60 text-xs mb-1">
                  Click to upload images
                </p>
                <p className="text-white/40 text-xs">
                  PNG, JPG, GIF, WebP up to 10MB
                </p>
              </div>
            </div>
          </Button>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div className="text-xs text-blue-400 font-medium">
            ✓ Selected for context
          </div>
        )}
      </div>

      {/* Image Upload Sheet */}
      <ImageUploadSheet 
        isOpen={uploadSheetOpen}
        onClose={() => setUploadSheetOpen(false)}
      />
    </Card>
  );
}