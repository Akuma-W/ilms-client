'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TopicModal } from './topic-modal';

interface CreateTopicModalProps {
  classId: string;
  onSuccess: () => void;
}

/**
 * Trigger button & dialog wrapper for teachers to create a new lecture topic.
 */
export function CreateTopicModal({ classId, onSuccess }: CreateTopicModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm h-9 px-3 font-medium cursor-pointer"
      >
        <Plus className="size-4" />
        Thêm chủ đề
      </Button>

      <TopicModal
        classId={classId}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        mode="create"
        onSuccess={onSuccess}
      />
    </>
  );
}
