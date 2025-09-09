'use client';

import MDEditor from '@uiw/react-md-editor';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className = '' }: MarkdownViewerProps) {
  return (
    <div className={`markdown-viewer ${className}`}>
      <style jsx global>{`
        .markdown-viewer .wmde-markdown {
          background-color: transparent !important;
          color: white !important;
        }
        
        .markdown-viewer .wmde-markdown pre,
        .markdown-viewer .wmde-markdown pre code,
        .markdown-viewer .wmde-markdown pre tt {
          background-color: #1a1a1a !important;
          color: #e5e5e5 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        
        .markdown-viewer .wmde-markdown code {
          background-color: #2a2a2a !important;
          color: #e5e5e5 !important;
          padding: 2px 4px !important;
          border-radius: 4px !important;
        }
        
        .markdown-viewer .wmde-markdown blockquote {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-left: 4px solid rgba(255, 255, 255, 0.3) !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .markdown-viewer .wmde-markdown h1,
        .markdown-viewer .wmde-markdown h2,
        .markdown-viewer .wmde-markdown h3,
        .markdown-viewer .wmde-markdown h4,
        .markdown-viewer .wmde-markdown h5,
        .markdown-viewer .wmde-markdown h6 {
          color: white !important;
          border-bottom-color: rgba(255, 255, 255, 0.2) !important;
        }
        
        .markdown-viewer .wmde-markdown table {
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
        
        .markdown-viewer .wmde-markdown th,
        .markdown-viewer .wmde-markdown td {
          border-color: rgba(255, 255, 255, 0.2) !important;
          color: white !important;
        }
        
        .markdown-viewer .wmde-markdown th {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
      <MDEditor.Markdown 
        source={content} 
        style={{
          backgroundColor: 'transparent',
          color: 'white',
        }}
        className="!bg-transparent text-white"
      />
    </div>
  );
}