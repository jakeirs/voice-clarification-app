'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { 
  Upload, 
  X,
  Image as ImageIcon,
  Check,
  Trash2
} from 'lucide-react';

interface ImageUploadSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImageUploadSheet({ isOpen, onClose }: ImageUploadSheetProps) {
  const { 
    uploadedImages, 
    addUploadedImage, 
    removeUploadedImage,
    clearUploadedImages
  } = useAppStore();
  
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      // Validate file type and size (max 10MB)
      if (file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024) {
        addUploadedImage(file);
      }
    });
    setDragActive(false);
  }, [addUploadedImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    noClick: false
  });

  const handleRemoveImage = (index: number) => {
    removeUploadedImage(index);
  };

  const handleClearAll = () => {
    clearUploadedImages();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <span>Upload Image References</span>
          </SheetTitle>
          <SheetDescription>
            Upload reference images to inspire your UI design generation.
            Supported formats: PNG, JPG, GIF, WebP (max 10MB each)
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Upload Area */}
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragActive || dragActive
                ? 'border-blue-400 bg-blue-500/10' 
                : 'border-white/30 hover:border-white/40 hover:bg-white/5'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-white/60" />
              </div>
              <div>
                <p className="text-white text-lg font-medium mb-2">
                  {isDragActive || dragActive ? 'Drop images here' : 'Drop images here or click to browse'}
                </p>
                <p className="text-white/60 text-sm">
                  PNG, JPG, GIF, WebP up to 10MB each
                </p>
              </div>
              <Button 
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                Choose Files
              </Button>
            </div>
          </div>

          {/* Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">
                  Uploaded Images ({uploadedImages.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((file, index) => (
                  <div key={index} className="relative group bg-white/5 rounded-lg overflow-hidden">
                    <div className="aspect-square">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Remove button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-500/80 hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-3 w-3 text-white" />
                    </Button>
                    
                    {/* File info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                      <p className="text-xs text-white/90 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-white/60">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2 text-sm text-white/60">
              <Check className="w-4 h-4" />
              <span>{uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} ready for design generation</span>
            </div>
            <Button 
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Done
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}