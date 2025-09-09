'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { MoreVertical, FileText, Check } from 'lucide-react';

interface ContextCardProps {
  id: string;
  title: string;
  description?: string;
  onShowPrompt?: () => void;
}

export function ContextCard({ id, title, description, onShowPrompt }: ContextCardProps) {
  const { selectedContextCards, toggleContextCard } = useAppStore();
  const isSelected = selectedContextCards.includes(id);

  const handleToggle = () => {
    toggleContextCard(id);
  };

  return (
    <Card 
      className={`glass-secondary p-4 cursor-pointer transition-all hover:bg-white/5 relative ${
        isSelected ? 'ring-2 ring-blue-400/50 bg-blue-500/10' : ''
      }`}
      onClick={handleToggle}
    >
      {/* Three dots menu */}
      <div className="absolute top-3 right-3">
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
                onShowPrompt?.();
              }}
              className="text-white hover:bg-white/10"
            >
              Show Prompt
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
              <FileText className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm mb-1">
              {title}
            </h3>
            {description && (
              <p className="text-white/60 text-xs leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

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