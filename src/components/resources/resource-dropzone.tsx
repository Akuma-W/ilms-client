'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, FolderUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ResourceDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  multiple?: boolean;
  hintText?: string;
  className?: string;
}

/**
 * Universal Drag & Drop zone supporting single or multiple file uploads.
 */
export function ResourceDropzone({
  onFilesSelected,
  disabled = false,
  multiple = true,
  hintText,
  className,
}: ResourceDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled || !e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(multiple ? files : [files[0]]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    onFilesSelected(multiple ? files : [files[0]]);
    // Reset input so re-selecting the same file fires change event
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
      className={cn(
        'group relative border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all select-none',
        isDragOver
          ? 'border-emerald-500 bg-emerald-500/10 scale-[1.005]'
          : 'border-border/80 bg-muted/20 hover:border-emerald-500/60 hover:bg-muted/40',
        disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
        className,
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />

      <div className="flex flex-col items-center justify-center gap-1.5">
        <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
          {isDragOver ? <FolderUp className="size-5" /> : <UploadCloud className="size-5" />}
        </div>
        <div>
          <p className="text-xs sm:text-sm font-medium text-foreground">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold underline underline-offset-2">
              Nhấn để tải lên
            </span>{' '}
            hoặc kéo thả tệp vào đây
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {hintText || 'Hỗ trợ PDF, Word, Slide PowerPoint, Video MP4, Audio, v.v. (tối đa 50MB)'}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className="mt-1 h-7 text-xs rounded-lg pointer-events-none text-muted-foreground"
        >
          {multiple ? 'Chọn một hoặc nhiều tệp' : 'Chọn tệp'}
        </Button>
      </div>
    </div>
  );
}
