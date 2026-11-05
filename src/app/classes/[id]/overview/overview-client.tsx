'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  Link as LinkIcon,
  Play,
  Presentation,
  Trash2,
  Paperclip,
  ExternalLink,
  Video,
  Plus,
  Download,
  Eye,
  Calendar,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CreateTopicModal } from '@/features/classes/components/modals/create-topic-modal';
import { CreateMaterialModal } from '@/features/classes/components/modals/create-material-modal';
import { topicsService } from '@/features/classes/services/topics.service';
import { materialsService } from '@/features/classes/services/materials.service';
import { Topic, Material } from '@/types/topic';

export type TopicWithMaterials = Topic & { materials: Material[] };

interface OverviewClientProps {
  classId: string;
  initialTopics: TopicWithMaterials[];
  isTeacher: boolean;
  meetingUri: string | null;
}

function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
  );
  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
}

/**
 * Client Component for the Class Overview tab.
 * Adheres to Cyber Cyan (#06b6d4) theme per DOC-UIX-LAY-05.
 */
export function OverviewClient({
  classId,
  initialTopics,
  isTeacher,
  meetingUri,
}: OverviewClientProps) {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(() => {
    // Expand the first topic by default if available
    const initial: Record<string, boolean> = {};
    if (initialTopics.length > 0) {
      initial[initialTopics[0].id] = true;
    }
    return initial;
  });

  const [activeTopicForMaterial, setActiveTopicForMaterial] = useState<string | null>(null);
  const [previewMaterial, setPreviewMaterial] = useState<{
    material: Material;
    topicTitle: string;
  } | null>(null);

  // Fetch topics and materials with SWR for reactive updates
  const { data: topics = [], mutate } = useSWR(
    `classes/${classId}/overview-data`,
    async () => {
      const fetchedTopics = await topicsService.getTopics(classId);
      const safeTopics = Array.isArray(fetchedTopics) ? fetchedTopics : [];
      const withMaterials = await Promise.all(
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
      return withMaterials;
    },
    {
      fallbackData: initialTopics,
      revalidateOnMount: false,
    },
  );

  const toggleExpand = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const handleDeleteTopic = async (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      !confirm('Bạn có chắc chắn muốn xóa bài giảng này cùng toàn bộ tài liệu bên trong không?')
    ) {
      return;
    }

    try {
      const res = await topicsService.deleteTopic(topicId);
      if (!res.success) throw new Error(res.message);
      toast.success('Xóa bài giảng thành công!');
      mutate();
    } catch (error) {
      toast.error('Xóa bài giảng thất bại', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại.',
      });
    }
  };

  const handleDeleteMaterial = async (materialId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) {
      return;
    }

    try {
      const res = await materialsService.deleteMaterial(materialId);
      if (!res.success) throw new Error(res.message);
      toast.success('Xóa tài liệu thành công!');
      mutate();
    } catch (error) {
      toast.error('Xóa tài liệu thất bại', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại.',
      });
    }
  };

  const renderMaterialIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="size-4 text-blue-500 shrink-0" />;
      case 'pdf':
        return <FileText className="size-4 text-red-500 shrink-0" />;
      case 'slide':
        return <Presentation className="size-4 text-orange-500 shrink-0" />;
      case 'document':
        return <FileText className="size-4 text-emerald-500 shrink-0" />;
      default:
        return <LinkIcon className="size-4 text-purple-500 shrink-0" />;
    }
  };

  const renderMaterialBadge = (type: string) => {
    const config: Record<string, { label: string; bg: string; text: string }> = {
      pdf: {
        label: 'PDF',
        bg: 'bg-red-500/10 border-red-500/20',
        text: 'text-red-700 dark:text-red-300',
      },
      slide: {
        label: 'Slide',
        bg: 'bg-orange-500/10 border-orange-500/20',
        text: 'text-orange-700 dark:text-orange-300',
      },
      video: {
        label: 'Video',
        bg: 'bg-blue-500/10 border-blue-500/20',
        text: 'text-blue-700 dark:text-blue-300',
      },
      document: {
        label: 'Tài liệu',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-300',
      },
      link: {
        label: 'Liên kết',
        bg: 'bg-purple-500/10 border-purple-500/20',
        text: 'text-purple-700 dark:text-purple-300',
      },
    };

    const item = config[type] || config.link;
    return (
      <span
        className={`px-2 py-0.5 text-[11px] font-medium rounded border ${item.bg} ${item.text}`}
      >
        {item.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* 1. Google Meet Banner (Cyber Cyan theme) */}
      {meetingUri && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 dark:bg-cyan-950/20 text-card-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
              <Video className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Phòng học trực tuyến Google Meet
              </h3>
              <p className="text-xs text-muted-foreground">
                Lớp học có sẵn đường dẫn kết nối trực tiếp với giảng viên.
              </p>
            </div>
          </div>

          <Button
            asChild
            size="sm"
            className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs h-8.5 px-4 font-medium shrink-0"
          >
            <a href={meetingUri} target="_blank" rel="noopener noreferrer">
              Tham gia phòng học
              <ExternalLink className="size-3.5 ml-1.5" />
            </a>
          </Button>
        </div>
      )}

      {/* 2. Topic Header & Actions */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Danh mục bài giảng & chuyên đề
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Lộ trình học tập chi tiết được sắp xếp theo từng chủ đề bài học.
          </p>
        </div>

        {isTeacher && <CreateTopicModal classId={classId} onSuccess={() => mutate()} />}
      </div>

      {/* 3. Topics Accordion List */}
      {topics.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border bg-card/50">
          <div className="flex items-center justify-center size-12 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mx-auto mb-3">
            <BookOpen className="size-6" />
          </div>
          <h3 className="text-sm font-medium text-foreground">Chưa có bài giảng nào</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            {isTeacher
              ? 'Hãy bấm nút "Thêm bài giảng mới" để thiết lập lộ trình học tập cho sinh viên.'
              : 'Giảng viên chưa đăng tải nội dung bài giảng cho học phần này.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {topics.map((topic, index) => {
            const isExpanded = !!expandedTopics[topic.id];
            const materialList = topic.materials || [];

            return (
              <div
                key={topic.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'border-cyan-500/40 bg-card shadow-sm'
                    : 'border-border/80 bg-card/60 hover:border-border'
                }`}
              >
                {/* Topic Header Accordion Trigger */}
                <div
                  onClick={() => toggleExpand(topic.id)}
                  className="flex items-center justify-between p-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3 min-w-0 pr-4">
                    <div
                      className={`flex items-center justify-center size-8 rounded-lg shrink-0 mt-0.5 ${
                        isExpanded
                          ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <span className="text-xs font-semibold">{index + 1}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground truncate">
                          {topic.title}
                        </h4>
                        <span className="text-[11px] text-muted-foreground px-2 py-0.5 rounded-full bg-muted font-normal">
                          {materialList.length} tài liệu
                        </span>
                      </div>

                      {topic.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {topic.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Action Icons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isTeacher && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTopicForMaterial(topic.id);
                          }}
                          className="cursor-pointer text-xs h-8 px-2.5 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/10"
                        >
                          <Plus className="size-3.5 mr-1" />
                          Thêm tài liệu
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDeleteTopic(topic.id, e)}
                          className="cursor-pointer size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </>
                    )}

                    <div className="text-muted-foreground p-1">
                      {isExpanded ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Materials List */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-border/50">
                    {materialList.length === 0 ? (
                      <div className="py-6 text-center text-xs text-muted-foreground flex flex-col items-center justify-center">
                        <Paperclip className="size-5 mb-1.5 opacity-40" />
                        <span>Chuyên đề này chưa có tài liệu nào được đính kèm.</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                        {materialList.map((material: Material) => (
                          <div
                            key={material.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              {renderMaterialIcon(material.materialType)}
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-foreground truncate">
                                  {material.title}
                                </p>
                                <div className="mt-0.5">
                                  {renderMaterialBadge(material.materialType)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setPreviewMaterial({ material, topicTitle: topic.title })
                                }
                                className="size-7 cursor-pointer text-muted-foreground hover:text-cyan-600 dark:hover:text-cyan-400"
                                title="Xem trước tài liệu"
                              >
                                <Eye className="size-3.5" />
                              </Button>

                              {material.materialType === 'link' ? (
                                <Button
                                  asChild
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 cursor-pointer text-muted-foreground hover:text-foreground"
                                  title="Mở liên kết"
                                >
                                  <a
                                    href={material.externalUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="size-3.5" />
                                  </a>
                                </Button>
                              ) : (
                                <Button
                                  asChild
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 cursor-pointer text-muted-foreground hover:text-foreground"
                                  title="Tải tệp tin"
                                >
                                  <a
                                    href={material.fileUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                  >
                                    <Download className="size-3.5" />
                                  </a>
                                </Button>
                              )}

                              {isTeacher && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => handleDeleteMaterial(material.id, e)}
                                  className="size-7 cursor-pointer text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  title="Xóa tài liệu"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Material Preview Dialog */}
      <Dialog
        open={Boolean(previewMaterial)}
        onOpenChange={(open) => !open && setPreviewMaterial(null)}
      >
        <DialogContent className="sm:max-w-2xl rounded-xl border border-border bg-card text-card-foreground shadow-xl p-6">
          {previewMaterial && (
            <>
              <DialogHeader className="space-y-1 pb-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  {renderMaterialBadge(previewMaterial.material.materialType)}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Layers className="size-3" />
                    {previewMaterial.topicTitle}
                  </span>
                </div>
                <DialogTitle className="text-base md:text-lg font-bold text-foreground">
                  {previewMaterial.material.title}
                </DialogTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" />
                  Đã tải lên vào ngày{' '}
                  {new Date(previewMaterial.material.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </DialogHeader>

              {/* Preview Body */}
              <div className="py-4">
                {previewMaterial.material.materialType === 'video' ? (
                  <div className="space-y-3">
                    {(() => {
                      const ytEmbed = getYouTubeEmbedUrl(
                        previewMaterial.material.externalUrl || previewMaterial.material.fileUrl,
                      );
                      if (ytEmbed) {
                        return (
                          <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-black">
                            <iframe
                              src={ytEmbed}
                              title={previewMaterial.material.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        );
                      }
                      if (previewMaterial.material.fileUrl) {
                        return (
                          <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-black">
                            <video
                              src={previewMaterial.material.fileUrl}
                              controls
                              className="w-full h-full object-contain"
                            >
                              Trình duyệt của bạn không hỗ trợ phát video này.
                            </video>
                          </div>
                        );
                      }
                      return (
                        <div className="p-8 text-center rounded-xl border border-border bg-muted/30">
                          <Play className="size-10 text-blue-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">Video ngoại tuyến hoặc liên kết</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Bấm nút bên dưới để mở video trên trang gốc.
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                ) : previewMaterial.material.materialType === 'link' ? (
                  <div className="p-6 rounded-xl border border-purple-500/20 bg-purple-500/5 text-center">
                    <div className="size-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-3">
                      <LinkIcon className="size-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Liên kết tài nguyên bên ngoài
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-md mx-auto">
                      {previewMaterial.material.externalUrl}
                    </p>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-center">
                    <div className="size-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-3">
                      <FileText className="size-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Tệp tin học tập (MinIO Storage)
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-md mx-auto">
                      {previewMaterial.material.fileUrl || 'Chưa có đường dẫn tệp tin'}
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-row items-center justify-between sm:justify-between pt-3 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMaterial(null)}
                  className="cursor-pointer text-xs rounded-lg"
                >
                  Đóng
                </Button>

                <div className="flex items-center gap-2">
                  {previewMaterial.material.materialType === 'link' ? (
                    <Button
                      size="sm"
                      asChild
                      className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg"
                    >
                      <a
                        href={previewMaterial.material.externalUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="size-3.5 mr-1.5" />
                        Mở liên kết
                      </a>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      asChild
                      className="cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded-lg"
                    >
                      <a
                        href={previewMaterial.material.fileUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <Download className="size-3.5 mr-1.5" />
                        Tải tệp tin
                      </a>
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal to add material to active topic */}
      {activeTopicForMaterial && (
        <CreateMaterialModal
          topicId={activeTopicForMaterial}
          isOpen={!!activeTopicForMaterial}
          onOpenChange={(open) => !open && setActiveTopicForMaterial(null)}
          onSuccess={() => mutate()}
        />
      )}
    </div>
  );
}
