'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { PromptDetails } from './PromptDetails';
import { UIDesignsTab } from './UIDesignsTab';
import { GeneratePRDTab } from './GeneratePRDTab';
import { Transcript } from '@/types';
import { 
  Save,
  Edit,
  Trash2
} from 'lucide-react';

interface TranscriptDetailsProps {
  transcript: Transcript;
  isOpen: boolean;
  onClose: () => void;
}

export function TranscriptDetails({ transcript, isOpen, onClose }: TranscriptDetailsProps) {
  const { updateTranscript, deleteTranscript, activeTab, setActiveTab } = useAppStore();
  
  // Local state for editing
  const [editedTitle, setEditedTitle] = useState(transcript.title);
  const [editedText, setEditedText] = useState(transcript.text);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleTitleSave = () => {
    if (editedTitle.trim()) {
      updateTranscript(transcript.id, { title: editedTitle.trim() });
      setIsEditingTitle(false);
    }
  };

  const handleTextSave = () => {
    if (editedText.trim()) {
      updateTranscript(transcript.id, { text: editedText.trim() });
      setIsEditingText(false);
    }
  };

  const handleDelete = () => {
    deleteTranscript(transcript.id);
    onClose();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-3xl flex flex-col h-full">
          <SheetHeader className="flex-shrink-0">
            {/* Editable Title */}
            <div className="flex items-center space-x-2">
              {isEditingTitle ? (
                <div className="flex items-center space-x-2 flex-1">
                  <input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/20 rounded px-3 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter title..."
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleTitleSave}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 flex-1">
                  <SheetTitle className="text-white text-xl">{editedTitle}</SheetTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingTitle(true)}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
            <SheetDescription className="text-white/60">
              Created on {formatDate(transcript.createdAt)} at {formatTime(transcript.createdAt)}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 flex-1 overflow-hidden flex flex-col">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'transcript' | 'generate-prd' | 'ui-designs')} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 flex-shrink-0">
                <TabsTrigger value="transcript" className="text-white data-[state=active]:bg-white/10">
                  Raw Transcript
                </TabsTrigger>
                <TabsTrigger value="generate-prd" className="text-white data-[state=active]:bg-white/10">
                  Generate PRD
                </TabsTrigger>
                <TabsTrigger value="ui-designs" className="text-white data-[state=active]:bg-white/10">
                  UI Designs
                </TabsTrigger>
              </TabsList>

              {/* Raw Transcript Tab */}
              <TabsContent value="transcript" className="mt-6 space-y-4 flex-1 overflow-y-auto">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">Transcript</label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (isEditingText) {
                          handleTextSave();
                        } else {
                          setIsEditingText(true);
                        }
                      }}
                      className="text-xs bg-white/10 hover:bg-white/15"
                    >
                      {isEditingText ? (
                        <>
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </>
                      ) : (
                        <>
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>

                  {isEditingText ? (
                    <Textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="min-h-32 bg-white/5 border-white/20 text-white placeholder:text-white/50 resize-none"
                      rows={8}
                    />
                  ) : (
                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg min-h-32">
                      <p className="text-white leading-relaxed whitespace-pre-wrap">
                        {editedText}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Generate PRD Tab */}
              <TabsContent value="generate-prd" className="mt-6 space-y-6 flex-1 overflow-y-auto">
                <GeneratePRDTab 
                  transcript={{
                    ...transcript,
                    text: editedText // Use current edited text as single source of truth
                  }} 
                />
              </TabsContent>

              {/* UI Designs Tab */}
              <TabsContent value="ui-designs" className="mt-6 space-y-6 flex-1 overflow-y-auto">
                <UIDesignsTab 
                  transcript={{
                    ...transcript,
                    text: editedText // Use current edited text as single source of truth
                  }} 
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Actions at bottom */}
          <div className="flex justify-between pt-6 mt-6 border-t border-white/10 flex-shrink-0">
            <div>
              {confirmDelete ? (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Confirm Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirmDelete(false)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/15"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setConfirmDelete(true)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/15"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>

            <div className="text-xs text-white/50">
              Last updated: {formatDate(transcript.updatedAt)} at {formatTime(transcript.updatedAt)}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}