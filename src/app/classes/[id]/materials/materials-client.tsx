'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { BookOpen, ChevronsUpDown, FileText, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TopicItem } from '@/features/classes/components/topics/topic-item';
import { ResourcePreviewModal } from '@/features/classes/components/topics/resource-preview-modal';
import { CreateMaterialModal } from '@/features/classes/components/modals/create-material-modal';
import { topicsService } from '@/features/classes/services/topics.service';
import { materialsService } from '@/features/classes/services/materials.service';
import { getMockTopics } from '@/mocks/classes/class-data.mock';
import type { Topic, MaterialWithTopic, UnifiedResource } from '@/types/topic';

interface MaterialsClientProps {
  classId: string;
  initialMaterials?: MaterialWithTopic[];
  topics?: Topic[];
  isTeacher: boolean;
}

/**
 * Client Component for Class Materials tab (Lectures & References Hub).
 * Adheres to Emerald Green (#10b981) theme and full-width layout.
 */
export function MaterialsClient({
  classId,
  topics: initialTopics = [],
  isTeacher,
}: MaterialsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopicForMaterial, setActiveTopicForMaterial] = useState<string | null>(null);
  const [isTopAddOpen, setIsTopAddOpen] = useState(false);
  const [previewResource, setPreviewResource] = useState<UnifiedResource | null>(null);

  // SWR fetching topics with materials and mock fallback
  const { data: topics = [], mutate } = useSWR(
    `classes/${classId}/materials-data`,
    async () => {
      try {
        const fetchedTopics = await topicsService.getTopics(classId);
        const safeTopics = Array.isArray(fetchedTopics) ? fetchedTopics : [];
        if (safeTopics.length === 0) {
          return getMockTopics(classId);
        }
        return await Promise.all(
          safeTopics.map(async (topic) => {
            try {
              const materials = await materialsService.getMaterials(topic.id);
              return {
                ...topic,
                materials: Array.isArray(materials) ? materials : [],
              };
            } catch {
              return { ...topic, materials: [] };
            }
          }),
        );
      } catch {
        return getMockTopics(classId);
      }
    },
    {
      fallbackData: initialTopics.length > 0 ? initialTopics : getMockTopics(classId),
      revalidateOnMount: false,
    },
  );

  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const source = topics.length > 0 ? topics : initialTopics;
    if (source.length > 0) {
      initial[source[0].id] = true;
    }
    return initial;
  });

  const toggleExpand = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const toggleExpandAll = () => {
    const allExpanded = topics.every((t) => expandedTopics[t.id]);
    const nextState: Record<string, boolean> = {};
    topics.forEach((t) => {
      nextState[t.id] = !allExpanded;
    });
    setExpandedTopics(nextState);
  };

  const handleDeleteResource = async (resource: UnifiedResource) => {
    if (resource.kind !== 'material') {
      toast.info('Tài liệu tham khảo hiện đang được bảo vệ.');
      return;
    }
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) {
      return;
    }

    try {
      const res = await materialsService.deleteMaterial(resource.data.id);
      if (!res.success) throw new Error(res.message);
      toast.success('Xóa tài liệu thành công!');
      mutate();
    } catch (error) {
      toast.error('Xóa tài liệu thất bại', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại.',
      });
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chủ đề này không?')) {
      return;
    }

    try {
      const res = await topicsService.deleteTopic(topicId);
      if (!res.success) throw new Error(res.message);
      toast.success('Xóa chủ đề thành công!');
      mutate();
    } catch (error) {
      toast.error('Xóa chủ đề thất bại', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại.',
      });
    }
  };

  // Filter topics based on search term
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const query = searchQuery.toLowerCase();
    return topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(query) ||
        topic.description?.toLowerCase().includes(query) ||
        topic.materials?.some((m) => m.title.toLowerCase().includes(query)) ||
        topic.references?.some((r) => r.title.toLowerCase().includes(query)),
    );
  }, [topics, searchQuery]);

  return (
    <div className="w-full space-y-6">
      {/* 1. Header & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="size-5 text-emerald-600 dark:text-emerald-400" />
            Bài giảng & Tài liệu tham khảo
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tổng hợp bài giảng, slide, video và tài liệu nghiên cứu tham khảo theo từng chủ đề.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-8.5 rounded-lg"
            />
          </div>

          {topics.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleExpandAll}
                  className="size-8.5 shrink-0 rounded-lg"
                >
                  <ChevronsUpDown className="size-4" />
                  <span className="sr-only">Mở/Thu gọn tất cả</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Mở rộng / Thu gọn tất cả</TooltipContent>
            </Tooltip>
          )}

          {isTeacher && (
            <Button
              onClick={() => setIsTopAddOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 rounded-lg px-3 shrink-0"
            >
              <Plus className="size-3.5 mr-1.5" />
              Thêm tài liệu
            </Button>
          )}
        </div>
      </div>

      {/* 2. Topics List (Mode: materials -> only materials + references) */}
      {filteredTopics.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border bg-card/50">
          <div className="flex items-center justify-center size-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto mb-3">
            <BookOpen className="size-6" />
          </div>
          <h3 className="text-sm font-medium text-foreground">
            {searchQuery ? 'Không tìm thấy tài liệu nào phù hợp' : 'Chưa có tài liệu học tập'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            {searchQuery
              ? 'Vui lòng thử tìm kiếm với từ khóa khác.'
              : isTeacher
                ? 'Hãy bấm nút "Thêm tài liệu" để tải lên bài giảng hoặc tài liệu tham khảo cho sinh viên.'
                : 'Giảng viên chưa đăng tải học liệu cho lớp học này.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTopics.map((topic) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              classId={classId}
              isExpanded={!!expandedTopics[topic.id]}
              isTeacher={isTeacher}
              mode="materials"
              onToggleExpand={() => toggleExpand(topic.id)}
              onAddResource={(topicId) => setActiveTopicForMaterial(topicId)}
              onDeleteTopic={handleDeleteTopic}
              onPreviewResource={(item) => setPreviewResource(item)}
              onDeleteResource={handleDeleteResource}
            />
          ))}
        </div>
      )}

      {/* 3. Resource Preview Modal */}
      <ResourcePreviewModal
        resource={previewResource}
        isOpen={Boolean(previewResource)}
        onOpenChange={(open) => !open && setPreviewResource(null)}
      />

      {/* 4. Create Material Modal for specific topic */}
      {activeTopicForMaterial && (
        <CreateMaterialModal
          topicId={activeTopicForMaterial}
          topics={topics}
          isOpen={Boolean(activeTopicForMaterial)}
          onOpenChange={(open) => !open && setActiveTopicForMaterial(null)}
          onSuccess={() => mutate()}
        />
      )}

      {/* 5. Top-level Create Material Modal */}
      {isTopAddOpen && (
        <CreateMaterialModal
          topics={topics}
          isOpen={isTopAddOpen}
          onOpenChange={setIsTopAddOpen}
          onSuccess={() => mutate()}
        />
      )}
    </div>
  );
}
