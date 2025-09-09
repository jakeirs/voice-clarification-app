'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  MoreVertical,
  Download,
  Check
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
    uploadedImages, 
    addUploadedImage, 
    removeUploadedImage 
  } = useAppStore();
  
  const isSelected = selectedContextCards.includes(id);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      // Validate file type
      if (file.type.startsWith('image/')) {
        addUploadedImage(file);
      }
    });
  }, [addUploadedImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

  const handleToggle = () => {
    toggleContextCard(id);
  };

  const handleRemoveImage = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    removeUploadedImage(index);
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

        {/* Dropzone Area */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
            isDragActive || dragActive
              ? 'border-blue-400 bg-blue-500/10' 
              : 'border-white/20 hover:border-white/30 hover:bg-white/5'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            // The getRootProps already handles opening the file dialog
          }}
        >
          <input {...getInputProps()} />
          <Upload className="w-6 h-6 text-white/60 mx-auto mb-2" />
          <p className="text-white/60 text-xs mb-1">
            Drop images here or click to browse
          </p>
          <p className="text-white/40 text-xs">
            PNG, JPG, GIF, WebP up to 10MB
          </p>
        </div>

        {/* Uploaded Images Preview */}
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {uploadedImages.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-white/5 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 h-5 w-5 p-0 bg-red-500/80 hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleRemoveImage(index, e)}
                >
                  <X className="h-3 w-3 text-white" />
                </Button>
                <div className="absolute bottom-1 left-1 text-xs text-white/80 bg-black/50 px-1 rounded">
                  {file.name.length > 8 ? file.name.substring(0, 8) + '...' : file.name}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div className="text-xs text-blue-400 font-medium">
            ✓ Selected for context
          </div>
        )}
      </div>
    </Card>
  );
}