'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { BookOpen, ChevronsUpDown, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CreateTopicModal } from '@/features/classes/components/modals/create-topic-modal';
import { CreateMaterialModal } from '@/features/classes/components/modals/create-material-modal';
import { TopicItem } from '@/features/classes/components/topics/topic-item';
import { ResourcePreviewModal } from '@/features/classes/components/topics/resource-preview-modal';
import { topicsService } from '@/features/classes/services/topics.service';
import { materialsService } from '@/features/classes/services/materials.service';
import { getMockTopics } from '@/mocks/classes/class-data.mock';
import type { Topic, UnifiedResource } from '@/types/topic';

interface OverviewClientProps {
  classId: string;
  initialTopics: Topic[];
  isTeacher: boolean;
}

/**
 * Client Component for Class Overview tab in full-width Hub-and-Spoke layout.
 */
export function OverviewClient({ classId, initialTopics, isTeacher }: OverviewClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopicForMaterial, setActiveTopicForMaterial] = useState<string | null>(null);
  const [previewResource, setPreviewResource] = useState<UnifiedResource | null>(null);

  // SWR for reactive topics with mock fallback
  const { data: topics = [], mutate } = useSWR(
    `classes/${classId}/overview-data`,
    async () => {
      try {
        const fetchedTopics = await topicsService.getTopics(classId);
        const safeTopics = Array.isArray(fetchedTopics) ? fetchedTopics : [];

        // Mock data
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

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chủ đề này cùng toàn bộ tài liệu bên trong không?')) {
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

  const handleDeleteResource = async (resource: UnifiedResource) => {
    if (resource.kind !== 'material') {
      toast.info(`Chức năng quản lý ${resource.kind} đang được đồng bộ.`);
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

  // Filter topics by title or nested resources
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
      {/* 1. Topic Header & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Tổng quan Chủ đề bài giảng
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Lộ trình học tập được sắp xếp theo từng chủ đề bài học.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm tài nguyên..."
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

          {isTeacher && <CreateTopicModal classId={classId} onSuccess={() => mutate()} />}
        </div>
      </div>

      {/* 3. Topics Accordion List */}
      {filteredTopics.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border bg-card/50">
          <div className="flex items-center justify-center size-12 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mx-auto mb-3">
            <BookOpen className="size-6" />
          </div>
          <h3 className="text-sm font-medium text-foreground">
            {searchQuery ? 'Không tìm thấy tài nguyên nào phù hợp' : 'Chưa có chủ đề nào'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            {searchQuery
              ? 'Vui lòng thử tìm kiếm với từ khóa khác.'
              : isTeacher
                ? 'Hãy bấm nút "Thêm bài giảng mới" để thiết lập lộ trình học tập cho sinh viên.'
                : 'Giảng viên chưa đăng tải nội dung bài giảng cho học phần này.'}
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
              mode="overview"
              onToggleExpand={() => toggleExpand(topic.id)}
              onAddResource={(topicId) => setActiveTopicForMaterial(topicId)}
              onDeleteTopic={handleDeleteTopic}
              onPreviewResource={(item) => setPreviewResource(item)}
              onDeleteResource={handleDeleteResource}
            />
          ))}
        </div>
      )}

      {/* 4. Preview Modal */}
      <ResourcePreviewModal
        resource={previewResource}
        isOpen={Boolean(previewResource)}
        onOpenChange={(open) => !open && setPreviewResource(null)}
      />

      {/* 5. Create Material Modal */}
      {activeTopicForMaterial && (
        <CreateMaterialModal
          topicId={activeTopicForMaterial}
          topics={topics}
          isOpen={Boolean(activeTopicForMaterial)}
          onOpenChange={(open) => !open && setActiveTopicForMaterial(null)}
          onSuccess={() => mutate()}
        />
      )}
    </div>
  );
}
