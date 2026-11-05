'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import {
  BookOpen,
  FileText,
  Link as LinkIcon,
  Play,
  Presentation,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Download,
  Layers,
  Calendar,
  Eye,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CreateMaterialModal } from '@/features/classes/components/modals/create-material-modal';
import { topicsService } from '@/features/classes/services/topics.service';
import { materialsService } from '@/features/classes/services/materials.service';
import { Topic, Material } from '@/types/topic';
import { FileType } from '@/types/enum';

export type MaterialWithTopic = Material & { topicTitle: string };

interface MaterialsClientProps {
  classId: string;
  initialMaterials: MaterialWithTopic[];
  topics: Topic[];
  isTeacher: boolean;
}

type FilterType = 'all' | FileType;

/**
 * Helper to extract YouTube embed URL when applicable.
 */
function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
  );
  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
}

/**
 * Client Component for the Class Materials tab.
 * Adheres to Emerald Green (#10b981) theme per DOC-UIX-LAY-05 and lms-ai-assistant.
 */
export function MaterialsClient({
  classId,
  initialMaterials,
  topics,
  isTeacher,
}: MaterialsClientProps) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<MaterialWithTopic | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // SWR for reactive materials synchronization
  const { data: materials = [], mutate } = useSWR(
    `classes/${classId}/materials-data`,
    async () => {
      const fetchedTopics = await topicsService.getTopics(classId);
      const safeTopics = Array.isArray(fetchedTopics) ? fetchedTopics : [];
      const list = await Promise.all(
        safeTopics.map(async (topic) => {
          try {
            const mats = await materialsService.getMaterials(topic.id);
            const matList = Array.isArray(mats) ? mats : [];
            return matList.map((m) => ({ ...m, topicTitle: topic.title }));
          } catch {
            return [];
          }
        }),
      );
      return list.flat();
    },
    {
      fallbackData: initialMaterials,
      revalidateOnMount: false,
    },
  );

  // Calculate counts for stats bar
  const counts = useMemo(() => {
    return {
      all: materials.length,
      pdf: materials.filter((m) => m.materialType === 'pdf').length,
      slide: materials.filter((m) => m.materialType === 'slide').length,
      video: materials.filter((m) => m.materialType === 'video').length,
      document: materials.filter((m) => m.materialType === 'document').length,
      link: materials.filter((m) => m.materialType === 'link').length,
    };
  }, [materials]);

  // Filter materials based on search, type, and topic
  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.topicTitle.toLowerCase().includes(search.toLowerCase());
      const matchesType = activeFilter === 'all' || m.materialType === activeFilter;
      const matchesTopic = selectedTopicFilter === 'all' || m.topicId === selectedTopicFilter;
      return matchesSearch && matchesType && matchesTopic;
    });
  }, [materials, search, activeFilter, selectedTopicFilter]);

  // Handle material deletion
  const handleDeleteMaterial = async (materialId: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài liệu "${title}" không?`)) {
      return;
    }

    setDeletingId(materialId);
    try {
      const res = await materialsService.deleteMaterial(materialId);
      if (!res.success) {
        throw new Error(res.message || 'Xóa tài liệu thất bại');
      }

      toast.success('Đã xóa tài liệu thành công!');
      await mutate();
      if (previewMaterial?.id === materialId) {
        setPreviewMaterial(null);
      }
    } catch (error) {
      toast.error('Xóa tài liệu thất bại', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getMaterialIcon = (type: FileType) => {
    switch (type) {
      case 'video':
        return <Play className="size-4.5 text-blue-500 shrink-0" />;
      case 'pdf':
        return <FileText className="size-4.5 text-rose-500 shrink-0" />;
      case 'slide':
        return <Presentation className="size-4.5 text-amber-500 shrink-0" />;
      case 'document':
        return <FileText className="size-4.5 text-emerald-500 shrink-0" />;
      case 'link':
      default:
        return <LinkIcon className="size-4.5 text-purple-500 shrink-0" />;
    }
  };

  const getMaterialBadge = (type: FileType) => {
    switch (type) {
      case 'video':
        return (
          <Badge
            variant="outline"
            className="text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40"
          >
            Video bài giảng
          </Badge>
        );
      case 'pdf':
        return (
          <Badge
            variant="outline"
            className="text-[11px] font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40"
          >
            Tệp PDF
          </Badge>
        );
      case 'slide':
        return (
          <Badge
            variant="outline"
            className="text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40"
          >
            Slide trình chiếu
          </Badge>
        );
      case 'document':
        return (
          <Badge
            variant="outline"
            className="text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40"
          >
            Văn bản tài liệu
          </Badge>
        );
      case 'link':
      default:
        return (
          <Badge
            variant="outline"
            className="text-[11px] font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/40"
          >
            Liên kết ngoài
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner - Emerald Green Theme */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-emerald-500/20 bg-linear-to-r from-emerald-500/10 via-emerald-500/5 to-transparent backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <BookOpen className="size-3.5" />
              Kho học liệu Emerald
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            Thư viện tài liệu học tập
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Tất cả học liệu, slide, video và tài liệu tham khảo được phân loại khoa học theo từng
            chủ đề.
          </p>
        </div>

        {isTeacher && (
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-medium text-xs md:text-sm h-9 px-4 rounded-xl shrink-0 transition-colors"
          >
            <Plus className="size-4 mr-1.5" />
            Thêm tài liệu mới
          </Button>
        )}
      </div>

      {/* 6 Category Stat Cards with Interactive Filtering */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            type: 'all' as FilterType,
            label: 'Tất cả',
            count: counts.all,
            icon: BookOpen,
            color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          },
          {
            type: 'pdf' as FilterType,
            label: 'Tài liệu PDF',
            count: counts.pdf,
            icon: FileText,
            color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
          },
          {
            type: 'slide' as FilterType,
            label: 'Slide bài giảng',
            count: counts.slide,
            icon: Presentation,
            color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
          },
          {
            type: 'video' as FilterType,
            label: 'Video học tập',
            count: counts.video,
            icon: Play,
            color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
          },
          {
            type: 'document' as FilterType,
            label: 'Văn bản (Docs)',
            count: counts.document,
            icon: FileText,
            color: 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20',
          },
          {
            type: 'link' as FilterType,
            label: 'Liên kết ngoài',
            count: counts.link,
            icon: LinkIcon,
            color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
          },
        ].map((stat) => {
          const isActive = activeFilter === stat.type;
          return (
            <button
              key={stat.type}
              type="button"
              onClick={() => setActiveFilter(stat.type)}
              className={`cursor-pointer rounded-xl p-3.5 text-center transition-all duration-200 select-none border text-left flex flex-col justify-between ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]'
                  : 'bg-card text-card-foreground border-border/70 hover:border-emerald-500/40 hover:bg-muted/40 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`size-7 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-white/20 text-white' : stat.color
                  }`}
                >
                  <stat.icon className="size-3.5" />
                </div>
                {isActive && <CheckCircle2 className="size-3.5 text-white" />}
              </div>
              <div>
                <p
                  className={`text-[11px] font-medium uppercase tracking-wider ${
                    isActive ? 'text-white/80' : 'text-muted-foreground'
                  }`}
                >
                  {stat.label}
                </p>
                <p className="text-xl font-bold tracking-tight mt-0.5">{stat.count}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Topic Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/80 bg-card">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề tài liệu hoặc tên chủ đề..."
            className="pl-9 h-9 text-xs md:text-sm rounded-lg"
          />
        </div>

        {/* Topic Filter Dropdown */}
        {topics.length > 0 && (
          <div className="w-full sm:w-56">
            <Select value={selectedTopicFilter} onValueChange={setSelectedTopicFilter}>
              <SelectTrigger className="cursor-pointer h-9 text-xs rounded-lg">
                <div className="flex items-center gap-1.5 truncate">
                  <Filter className="size-3.5 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="Lọc theo chủ đề" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer text-xs">
                  Tất cả các chủ đề
                </SelectItem>
                {topics.map((t) => (
                  <SelectItem key={t.id} value={t.id} className="cursor-pointer text-xs">
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Quick Type Tabs */}
        <Tabs
          value={activeFilter}
          onValueChange={(val) => setActiveFilter(val as FilterType)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-6 sm:flex h-9 p-1 bg-muted/60 rounded-lg">
            <TabsTrigger value="all" className="cursor-pointer text-xs px-2.5 py-1">
              Tất cả
            </TabsTrigger>
            <TabsTrigger value="pdf" className="cursor-pointer text-xs px-2.5 py-1">
              PDF
            </TabsTrigger>
            <TabsTrigger value="slide" className="cursor-pointer text-xs px-2.5 py-1">
              Slide
            </TabsTrigger>
            <TabsTrigger value="video" className="cursor-pointer text-xs px-2.5 py-1">
              Video
            </TabsTrigger>
            <TabsTrigger value="document" className="cursor-pointer text-xs px-2.5 py-1">
              Docs
            </TabsTrigger>
            <TabsTrigger value="link" className="cursor-pointer text-xs px-2.5 py-1">
              Link
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Materials Grid / 4 UI States */}
      {filteredMaterials.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 md:p-16 text-center rounded-xl border border-dashed border-border/80 bg-muted/20">
          <div className="size-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground mb-3">
            <BookOpen className="size-6 text-muted-foreground/60" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            {search || activeFilter !== 'all' || selectedTopicFilter !== 'all'
              ? 'Không tìm thấy tài liệu phù hợp'
              : 'Chưa có tài liệu nào trong lớp học'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {search || activeFilter !== 'all' || selectedTopicFilter !== 'all'
              ? 'Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc chọn bộ lọc tệp tin khác.'
              : 'Giảng viên có thể bắt đầu tải lên tài liệu PDF, Slide, Video hoặc liên kết bài học.'}
          </p>

          {isTeacher && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="cursor-pointer mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs h-8.5 px-3.5 rounded-lg"
            >
              <Plus className="size-3.5 mr-1.5" />
              Thêm tài liệu ngay
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4.5 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all duration-200"
            >
              {/* Card Top: Icon, Title & Delete button */}
              <div>
                <div className="flex items-start justify-between gap-2.5 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-muted/60 border border-border/50 shrink-0">
                      {getMaterialIcon(material.materialType)}
                    </div>
                    {getMaterialBadge(material.materialType)}
                  </div>

                  {isTeacher && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMaterial(material.id, material.title)}
                      disabled={deletingId === material.id}
                      className="cursor-pointer size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
                      title="Xóa tài liệu"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {material.title}
                </h4>

                {/* Topic and Date metadata */}
                <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px] font-medium truncate max-w-[200px]">
                    <Layers className="size-3 shrink-0" />
                    {material.topicTitle}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px]">
                    <Calendar className="size-3 text-muted-foreground/70" />
                    {new Date(material.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              {/* Card Actions: Preview & Open/Download */}
              <div className="flex items-center gap-2 pt-4 mt-3 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMaterial(material)}
                  className="cursor-pointer flex-1 h-8 text-xs font-medium rounded-lg hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                >
                  <Eye className="size-3.5 mr-1" />
                  Xem trước
                </Button>

                {material.materialType === 'link' ? (
                  <Button
                    size="sm"
                    asChild
                    className="cursor-pointer h-8 text-xs font-medium rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                  >
                    <a href={material.externalUrl || '#'} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-3.5 mr-1" />
                      Mở link
                    </a>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    asChild
                    className="cursor-pointer h-8 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                  >
                    <a
                      href={material.fileUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Download className="size-3.5 mr-1" />
                      Tải về
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Material Preview Dialog (Bám sát lms-ai-assistant: Video Player & MinIO File Viewer) */}
      <Dialog
        open={Boolean(previewMaterial)}
        onOpenChange={(open) => !open && setPreviewMaterial(null)}
      >
        <DialogContent className="sm:max-w-2xl rounded-xl border border-border bg-card text-card-foreground shadow-xl p-6">
          {previewMaterial && (
            <>
              <DialogHeader className="space-y-1 pb-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  {getMaterialBadge(previewMaterial.materialType)}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Layers className="size-3" />
                    {previewMaterial.topicTitle}
                  </span>
                </div>
                <DialogTitle className="text-base md:text-lg font-bold text-foreground">
                  {previewMaterial.title}
                </DialogTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" />
                  Đã tải lên vào ngày{' '}
                  {new Date(previewMaterial.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </DialogHeader>

              {/* Preview Body based on Material Type */}
              <div className="py-4">
                {previewMaterial.materialType === 'video' ? (
                  <div className="space-y-3">
                    {(() => {
                      const ytEmbed = getYouTubeEmbedUrl(
                        previewMaterial.externalUrl || previewMaterial.fileUrl,
                      );
                      if (ytEmbed) {
                        return (
                          <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-black">
                            <iframe
                              src={ytEmbed}
                              title={previewMaterial.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        );
                      }
                      if (previewMaterial.fileUrl) {
                        return (
                          <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-black">
                            <video
                              src={previewMaterial.fileUrl}
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
                ) : previewMaterial.materialType === 'link' ? (
                  <div className="p-6 rounded-xl border border-purple-500/20 bg-purple-500/5 text-center">
                    <div className="size-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-3">
                      <LinkIcon className="size-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Liên kết tài nguyên bên ngoài
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-md mx-auto">
                      {previewMaterial.externalUrl}
                    </p>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
                    <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                      <FileText className="size-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Tệp tin học tập (MinIO Storage)
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-md mx-auto">
                      {previewMaterial.fileUrl || 'Chưa có đường dẫn tệp tin'}
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
                  {previewMaterial.materialType === 'link' ? (
                    <Button
                      size="sm"
                      asChild
                      className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg"
                    >
                      <a
                        href={previewMaterial.externalUrl || '#'}
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
                      className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg"
                    >
                      <a
                        href={previewMaterial.fileUrl || '#'}
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

      {/* Modal for creating a new material */}
      <CreateMaterialModal
        topics={topics}
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={async () => {
          await mutate();
        }}
      />
    </div>
  );
}
