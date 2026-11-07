'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Calendar, FileText, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ResourceDropzone } from '@/components/resources/resource-dropzone';
import { ResourceTopicSelect } from '@/components/resources/resource-topic-select';
import { AssignmentFileQueue } from './assignment-file-queue';
import { assignmentsService } from '../services/assignments.service';
import { assignmentFormSchema, type AssignmentFormValues } from '../schemas/assignment.schema';
import { inferMaterialTypeFromFileName } from '@/features/upload/utils/file.utils';
import type { Assignment, CreateAssignmentPayload } from '@/types/assignment';
import type { Topic } from '@/types/topic';
import type { FileType } from '@/types/enum';

interface AssignmentFormProps {
  mode: 'create' | 'edit';
  classId: string;
  assignmentId?: string;
  initialData?: Assignment | null;
  topics?: Topic[];
  defaultTopicId?: string;
}

export function AssignmentForm({
  mode,
  classId,
  assignmentId,
  initialData,
  topics = [],
  defaultTopicId,
}: AssignmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(
    initialData || null,
  );

  // Format existing ISO dueAt string or generate default today 23:59
  const getDefaultDueAt = () => {
    const today = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}T23:59`;
  };

  const formatIsoForDatetimeInput = (isoStr?: string | null) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return '';
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return '';
    }
  };

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      dueAt: formatIsoForDatetimeInput(initialData?.dueAt) || getDefaultDueAt(),
      maxScore: initialData?.maxScore ?? 10,
      topicId: initialData?.topicId || defaultTopicId || '',
      materials: (initialData?.materials || []).map((m) => ({
        fileUrl: m.fileUrl,
        fileType: m.fileType,
        fileName: m.fileName || m.fileUrl.split('/').pop(),
        fileSize: m.fileSize,
      })),
    },
  });

  const materials = form.watch('materials') || [];

  // Client-side hydration fallback if assignment was created locally in browser
  useEffect(() => {
    if (mode === 'edit' && !initialData && assignmentId) {
      assignmentsService.getAssignmentById(assignmentId).then((data) => {
        if (data) {
          setCurrentAssignment(data);
          form.reset({
            title: data.title || '',
            description: data.description || '',
            dueAt: formatIsoForDatetimeInput(data.dueAt) || getDefaultDueAt(),
            maxScore: data.maxScore ?? 10,
            topicId: data.topicId || defaultTopicId || '',
            materials: (data.materials || []).map((m) => ({
              fileUrl: m.fileUrl,
              fileType: m.fileType,
              fileName: m.fileName || m.fileUrl.split('/').pop(),
              fileSize: m.fileSize,
            })),
          });
        }
      });
    }
  }, [mode, initialData, assignmentId, defaultTopicId, form]);

  const handleFilesDropped = (files: File[]) => {
    const newItems = files.map((file) => ({
      fileUrl: URL.createObjectURL(file),
      fileType: inferMaterialTypeFromFileName(file.name) as FileType,
      fileName: file.name,
      fileSize: file.size,
    }));
    form.setValue('materials', [...materials, ...newItems], { shouldValidate: true });
    toast.success(`Đã thêm ${files.length} tệp đề bài`);
  };

  const handleRemoveMaterial = (index: number) => {
    const updated = materials.filter((_, idx) => idx !== index);
    form.setValue('materials', updated, { shouldValidate: true });
  };

  const onSubmit = async (values: AssignmentFormValues) => {
    setIsSubmitting(true);
    try {
      const isoDueAt = values.dueAt ? new Date(values.dueAt).toISOString() : null;
      const payload: CreateAssignmentPayload = {
        title: values.title.trim(),
        description: values.description?.trim() || null,
        dueAt: isoDueAt,
        maxScore: Number(values.maxScore) || 10,
        topicId: values.topicId || null,
        materials: values.materials?.map((m) => ({
          fileUrl: m.fileUrl,
          fileType: (m.fileType as FileType) || null,
          fileName: m.fileName,
          fileSize: m.fileSize,
        })),
      };

      if (mode === 'create') {
        const res = await assignmentsService.createAssignment(classId, payload);
        if (!res.success) throw new Error(res.message);
        toast.success('Giao bài tập mới thành công!');
        router.push(`/classes/${classId}/assignments`);
      } else {
        const idToUpdate = initialData?.id || currentAssignment?.id || assignmentId;
        if (!idToUpdate) throw new Error('Không tìm thấy mã bài tập.');
        const res = await assignmentsService.updateAssignment(idToUpdate, payload);
        if (!res.success) throw new Error(res.message);
        toast.success('Cập nhật bài tập thành công!');
        router.push(`/classes/${classId}/assignments/${idToUpdate}`);
      }
    } catch (error) {
      toast.error(mode === 'create' ? 'Giao bài tập thất bại' : 'Cập nhật thất bại', {
        description: error instanceof Error ? error.message : 'Vui lòng kiểm tra lại thông tin.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
      {/* 1. Form Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="size-9 rounded-xl hover:bg-muted"
            title="Quay lại"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              {mode === 'create' ? 'Giao bài tập mới' : 'Chỉnh sửa bài tập'}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {mode === 'create'
                ? 'Thiết lập yêu cầu, tài liệu đính kèm và thời hạn nộp bài cho sinh viên.'
                : 'Cập nhật nội dung đề bài hoặc gia hạn thời gian nộp bài.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="text-sm"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-amber-600 hover:bg-amber-700 text-white gap-2 font-medium shadow-xs"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            <span>{mode === 'create' ? 'Giao bài tập' : 'Lưu thay đổi'}</span>
          </Button>
        </div>
      </div>

      {/* 2. Form Body (2-Column Responsive Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2/3): Content & Files */}
        <div className="lg:col-span-2 space-y-5 bg-card p-6 rounded-2xl border border-border shadow-xs">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-foreground">
              Tiêu đề bài tập <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Ví dụ: BTVN 01: Cài đặt Danh sách liên kết đơn..."
              {...form.register('title')}
              className="text-sm h-10 font-medium"
            />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-foreground">
              Hướng dẫn & Yêu cầu làm bài
            </Label>
            <Textarea
              id="description"
              rows={8}
              placeholder="Nhập chi tiết yêu cầu đề bài, quy cách đặt tên file nộp, cấu trúc giải thuật..."
              {...form.register('description')}
              className="text-sm leading-relaxed resize-y min-h-30 max-h-90"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-border/60">
            <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="size-4 text-amber-600" />
              Tài liệu & Đề bài đính kèm (Nhiều tệp)
            </Label>
            <ResourceDropzone
              onFilesSelected={handleFilesDropped}
              disabled={isSubmitting}
              multiple={true}
              hintText="Hỗ trợ PDF, Word, Slide PowerPoint, Zip, v.v. (tối đa 50MB)"
            />
            <AssignmentFileQueue files={materials} onRemove={handleRemoveMaterial} />
          </div>
        </div>

        {/* Right Column (1/3): Settings Sidebar */}
        <div className="space-y-5 bg-card p-6 rounded-2xl border border-border shadow-xs">
          <h3 className="text-sm font-semibold text-foreground border-b border-border/60 pb-2">
            Cài đặt bài tập
          </h3>

          <div className="space-y-2">
            <ResourceTopicSelect
              topics={topics}
              selectedTopicId={form.watch('topicId') || ''}
              onTopicChange={(topicId: string) =>
                form.setValue('topicId', topicId, { shouldValidate: true })
              }
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="dueAt"
              className="text-sm font-semibold text-foreground flex items-center gap-1.5"
            >
              <Calendar className="size-3.5 text-amber-600" />
              Hạn chót nộp bài <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dueAt"
              type="datetime-local"
              {...form.register('dueAt')}
              className="text-sm h-10 font-mono"
            />
            {form.formState.errors.dueAt && (
              <p className="text-xs text-destructive">{form.formState.errors.dueAt.message}</p>
            )}
            <p className="text-[11px] text-muted-foreground">
              Sau thời gian này, bài nộp của sinh viên sẽ bị gắn nhãn &quot;Nộp trễ&quot;.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxScore" className="text-sm font-medium text-foreground">
              Thang điểm tối đa
            </Label>
            <Input
              id="maxScore"
              type="number"
              step="0.5"
              min="1"
              max="100"
              {...form.register('maxScore', { valueAsNumber: true })}
              className="text-sm h-10 font-mono"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
