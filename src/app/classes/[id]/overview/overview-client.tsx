'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { CreateTopicModal } from '@/features/topics/components/create-topic-modal';
import { TopicItem } from '@/features/topics/components/topic-item';
import { ResourcePreviewModal } from '@/features/topics/components/resource-preview-modal';
import { MaterialModal } from '@/features/materials/components/material-modal';
import { ReferenceModal } from '@/features/references/components/reference-modal';
import { ConfirmDeleteModal } from '@/components/common/confirm-delete-modal';
import { ClassTabToolbar } from '@/features/classes/components/layout/class-tab-toolbar';
import { topicsService } from '@/features/topics/services/topics.service';
import { materialsService } from '@/features/materials/services/materials.service';
import { referencesService } from '@/features/references/services/references.service';
import type { ResourceCreationType, Topic, UnifiedResource } from '@/types/topic';
import type { Material } from '@/types/material';
import type { Reference } from '@/types/reference';

interface OverviewClientProps {
  classId: string;
  initialTopics: Topic[];
  isTeacher: boolean;
}

/**
 * Client Component for Class Overview tab in full-width Hub-and-Spoke layout.
 */
export function OverviewClient({ classId, initialTopics, isTeacher }: OverviewClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [previewResource, setPreviewResource] = useState<UnifiedResource | null>(null);

  const [materialModal, setMaterialModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    topicId?: string;
    material?: Material | null;
  }>({ isOpen: false, mode: 'create' });

  const [referenceModal, setReferenceModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    topicId?: string;
    reference?: Reference | null;
  }>({ isOpen: false, mode: 'create' });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'material' | 'reference' | 'topic';
    id: string;
    name: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    type: 'material',
    id: '',
    name: '',
    isDeleting: false,
  });

  // SWR for reactive topics with service-encapsulated fallback
  const { data: topics = [], mutate } = useSWR(
    `classes/${classId}/overview-data`,
    () => topicsService.getTopicsWithResources(classId),
    {
      fallbackData: topicsService.getInitialTopics(classId, initialTopics),
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

  const handleAddResource = (topicId: string, type?: ResourceCreationType) => {
    if (type === 'reference') {
      setReferenceModal({ isOpen: true, mode: 'create', topicId, reference: null });
    } else if (type === 'assignment') {
      router.push(`/classes/${classId}/assignments?topicId=${topicId}`);
    } else if (type === 'quiz') {
      router.push(`/classes/${classId}/quizzes?topicId=${topicId}`);
    } else {
      setMaterialModal({ isOpen: true, mode: 'create', topicId, material: null });
    }
  };

  const handleEditResource = (resource: UnifiedResource) => {
    if (resource.kind === 'material') {
      setMaterialModal({
        isOpen: true,
        mode: 'edit',
        topicId: resource.data.topicId,
        material: resource.data,
      });
    } else if (resource.kind === 'reference') {
      setReferenceModal({
        isOpen: true,
        mode: 'edit',
        topicId: resource.data.topicId,
        reference: resource.data,
      });
    } else if (resource.kind === 'assignment') {
      router.push(`/classes/${classId}/assignments/${resource.data.id}`);
    } else if (resource.kind === 'quiz') {
      router.push(`/classes/${classId}/quizzes/${resource.data.id}`);
    }
  };

  const handleDeleteResource = (resource: UnifiedResource) => {
    if (resource.kind === 'material' || resource.kind === 'reference') {
      setDeleteModal({
        isOpen: true,
        type: resource.kind,
        id: resource.data.id,
        name: resource.data.title,
        isDeleting: false,
      });
    } else {
      toast.info('Vui lòng quản lý bài tập/trắc nghiệm tại tab chuyên biệt.');
    }
  };

  const handleDeleteTopic = (topicId: string) => {
    const targetTopic = topics.find((t) => t.id === topicId);
    setDeleteModal({
      isOpen: true,
      type: 'topic',
      id: topicId,
      name: targetTopic?.title || 'Chủ đề này',
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      const { type, id } = deleteModal;
      const res =
        type === 'material'
          ? await materialsService.deleteMaterial(id)
          : type === 'reference'
            ? await referencesService.deleteReference(id)
            : await topicsService.deleteTopic(id);

      if (!res.success) throw new Error(res.message);
      const label =
        type === 'topic' ? 'chủ đề' : type === 'material' ? 'bài giảng' : 'tài liệu tham khảo';
      toast.success(`Xóa ${label} thành công!`);
      mutate();
      setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
    } catch (error) {
      toast.error('Xóa thất bại', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại.',
      });
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
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
      {/* 1. Topic Header Toolbar (Unified ClassTabToolbar) */}
      <ClassTabToolbar
        title="Tổng quan Chủ đề bài giảng"
        description="Lộ trình học tập được sắp xếp theo từng chủ đề bài học."
        icon={BookOpen}
        iconColorClassName="text-cyan-600 dark:text-cyan-400"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm kiếm tài nguyên..."
        onToggleExpandAll={toggleExpandAll}
        showExpandAll={topics.length > 0}
        actions={isTeacher && <CreateTopicModal classId={classId} onSuccess={() => mutate()} />}
      />

      {/* 2. Topics Accordion List */}
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
                ? 'Hãy bấm nút "Thêm chủ đề" để thiết lập lộ trình học tập cho sinh viên.'
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
              onAddResource={handleAddResource}
              onEditResource={handleEditResource}
              onDeleteResource={handleDeleteResource}
              onDeleteTopic={handleDeleteTopic}
              onPreviewResource={(item) => setPreviewResource(item)}
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

      {/* 4. Material Modal (Unified Create & Edit) */}
      <MaterialModal
        topicId={materialModal.topicId}
        topics={topics}
        isOpen={materialModal.isOpen}
        mode={materialModal.mode}
        initialData={materialModal.material}
        onOpenChange={(open) => setMaterialModal((prev) => ({ ...prev, isOpen: open }))}
        onSuccess={() => mutate()}
      />

      {/* 5. Reference Modal (Unified Create & Edit) */}
      <ReferenceModal
        topicId={referenceModal.topicId}
        topics={topics}
        isOpen={referenceModal.isOpen}
        mode={referenceModal.mode}
        initialData={referenceModal.reference}
        onOpenChange={(open) => setReferenceModal((prev) => ({ ...prev, isOpen: open }))}
        onSuccess={() => mutate()}
      />

      {/* 6. Universal Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, isOpen: open }))}
        title={
          deleteModal.type === 'topic'
            ? 'Xác nhận xóa chủ đề'
            : deleteModal.type === 'material'
              ? 'Xác nhận xóa bài giảng'
              : 'Xác nhận xóa tài liệu tham khảo'
        }
        description={
          deleteModal.type === 'topic'
            ? 'Toàn bộ bài giảng và tài liệu học tập thuộc chủ đề này sẽ bị xóa vĩnh viễn.'
            : undefined
        }
        itemTypeLabel={
          deleteModal.type === 'topic'
            ? 'chủ đề bài học'
            : deleteModal.type === 'material'
              ? 'bài giảng học tập'
              : 'tài liệu tham khảo'
        }
        itemName={deleteModal.name}
        isDeleting={deleteModal.isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
