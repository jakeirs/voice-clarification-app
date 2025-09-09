'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';

interface ImageViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageTitle?: string;
  imageDate?: Date;
}

export function ImageViewerDialog({ 
  isOpen, 
  onClose, 
  imageUrl, 
  imageTitle = 'Generated Design',
  imageDate 
}: ImageViewerDialogProps) {
  const [zoom, setZoom] = useState(1);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageTitle.replace(/\s+/g, '_')}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] bg-black/95 border-white/20 p-0">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-lg">{imageTitle}</DialogTitle>
              {imageDate && (
                <p className="text-white/60 text-sm mt-1">
                  Generated on {imageDate.toLocaleDateString()} at {imageDate.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-1 bg-white/10 rounded-lg p-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="h-7 w-7 p-0 text-white hover:bg-white/10"
                >
                  <ZoomOut className="w-3 h-3" />
                </Button>
                <span 
                  className="text-xs text-white/80 min-w-12 text-center cursor-pointer hover:text-white"
                  onClick={resetZoom}
                >
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="h-7 w-7 p-0 text-white hover:bg-white/10"
                >
                  <ZoomIn className="w-3 h-3" />
                </Button>
              </div>

              {/* Download Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownload}
                className="text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>

              {/* Close Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Image Container */}
        <div className="flex-1 p-4 pt-2 overflow-hidden">
          <div className="w-full h-full overflow-auto flex items-center justify-center bg-white/5 rounded-lg">
            <img
              src={imageUrl}
              alt={imageTitle}
              className="max-w-none transition-transform duration-200 ease-in-out cursor-grab active:cursor-grabbing"
              style={{ 
                transform: `scale(${zoom})`,
                maxWidth: zoom <= 1 ? '100%' : 'none',
                maxHeight: zoom <= 1 ? '100%' : 'none'
              }}
              onDoubleClick={() => zoom === 1 ? handleZoomIn() : resetZoom()}
              draggable={false}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="px-4 pb-4">
          <p className="text-xs text-white/40 text-center">
            Double-click to zoom • Click percentage to reset • Drag to pan when zoomed
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}