'use client';

import React, { useState } from 'react';
import { Plus, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ResourceLinkInputProps {
  onAddLink: (url: string, title?: string, description?: string) => void;
  disabled?: boolean;
  placeholder?: string;
  showDescription?: boolean;
}

/**
 * Single/multi external link entry component that pushes into the staging queue.
 */
export function ResourceLinkInput({
  onAddLink,
  disabled = false,
  placeholder,
  showDescription = false,
}: ResourceLinkInputProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      toast.error('Vui lòng nhập đường dẫn liên kết');
      return;
    }

    try {
      // Validate valid URL protocol
      const parsed = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
      onAddLink(parsed.toString(), title.trim() || undefined, description.trim() || undefined);
      setUrl('');
      setTitle('');
      setDescription('');
      toast.success('Đã thêm liên kết vào danh sách');
    } catch {
      toast.error('Đường dẫn liên kết không hợp lệ. Vui lòng kiểm tra lại');
    }
  };

  return (
    <div className="p-3 rounded-xl border border-border/80 bg-muted/20 space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            placeholder={placeholder || 'https://youtube.com/watch?v=... hoặc liên kết bài học'}
            disabled={disabled}
            className="pl-8 text-xs h-8.5 rounded-lg bg-background"
          />
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => handleAdd()}
          disabled={disabled || !url.trim()}
          className="h-8.5 px-3 rounded-lg text-xs bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shrink-0"
        >
          <Plus className="size-3.5 mr-1" />
          Thêm link
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề gợi nhớ (tùy chọn)..."
          disabled={disabled}
          className="text-xs h-8 rounded-lg bg-background"
        />
        {showDescription && (
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ghi chú / Mô tả ngắn (tùy chọn)..."
            disabled={disabled}
            className="text-xs h-8 rounded-lg bg-background"
          />
        )}
      </div>
    </div>
  );
}
