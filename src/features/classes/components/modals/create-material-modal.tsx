'use client';

import {
  FileText,
  Link as LinkIcon,
  Play,
  Presentation,
  UploadCloud,
  X,
  FolderOpen,
  Layers,
} from 'lucide-react';
import { useId, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateMaterialFormValues, createMaterialSchema } from '../../schemas/topic.schema';
import { materialsService } from '../../services/materials.service';
import { FileType } from '@/types/enum';
import { Topic } from '@/types/topic';

interface CreateMaterialModalProps {
  topicId?: string;
  topics?: Topic[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DEFAULT_VALUES: CreateMaterialFormValues = {
  title: '',
  materialType: 'pdf' as FileType,
  fileUrl: '',
  externalUrl: '',
};

/**
 * Modal dialog for teachers to add learning materials (PDF, Slide, Video, Doc, Link) to a topic.
 */
export function CreateMaterialModal({
  topicId,
  topics,
  isOpen,
  onOpenChange,
  onSuccess,
}: CreateMaterialModalProps) {
  const formId = useId();
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    topicId || (topics && topics.length > 0 ? topics[0].id : ''),
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (topicId) {
      setSelectedTopicId(topicId);
    } else if (topics && topics.length > 0 && !selectedTopicId) {
      setSelectedTopicId(topics[0].id);
    }
  }, [topicId, topics, selectedTopicId]);

  const form = useForm<CreateMaterialFormValues>({
    resolver: zodResolver(createMaterialSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = form;

  const currentType = watch('materialType');
  const fileUrl = watch('fileUrl');

  const uploadSelectedFile = async (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(25);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setUploadProgress(60);
      const res = await materialsService.uploadFile(formData);
      setUploadProgress(90);

      if (!res.success || !res.data) {
        throw new Error(res.message || 'Tải lên tệp thất bại');
      }

      const fileUrlResult = res.data.url;
      setValue('fileUrl', fileUrlResult, { shouldValidate: true });

      // Auto-populate title from file name if current title is empty
      const currentTitle = form.getValues('title');
      if (!currentTitle) {
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setValue('title', nameWithoutExt, { shouldValidate: true });
      }

      setUploadProgress(100);
      toast.success('Tải lên tệp thành công!');
    } catch (error) {
      setSelectedFile(null);
      setValue('fileUrl', '');
      toast.error('Lỗi khi tải tệp lên', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại.',
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadSelectedFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadSelectedFile(files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setValue('fileUrl', '', { shouldValidate: true });
  };

  const handleClose = () => {
    if (isSubmitting || isUploading) return;
    onOpenChange(false);
    reset(DEFAULT_VALUES);
    setSelectedFile(null);
  };

  const onSubmit = async (values: CreateMaterialFormValues) => {
    const targetTopicId = topicId || selectedTopicId;
    if (!targetTopicId) {
      toast.error('Vui lòng chọn chủ đề bài học trước khi thêm tài liệu');
      return;
    }

    try {
      const payload = {
        title: values.title,
        materialType: values.materialType,
        fileUrl: values.materialType !== 'link' ? values.fileUrl : undefined,
        externalUrl: values.materialType === 'link' ? values.externalUrl : undefined,
      };

      const res = await materialsService.createMaterial(targetTopicId, payload);

      if (!res.success) {
        throw new Error(res.message || 'Tạo tài liệu thất bại');
      }

      toast.success('Thêm tài liệu thành công!');
      onSuccess();
      handleClose();
    } catch (error) {
      toast.error('Thêm tài liệu thất bại', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-lg rounded-xl border border-border bg-card text-card-foreground shadow-xl p-6"
        onInteractOutside={(e) => (isSubmitting || isUploading) && e.preventDefault()}
        onEscapeKeyDown={(e) => (isSubmitting || isUploading) && e.preventDefault()}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 pb-2 border-b border-border/50">
          <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            <FolderOpen className="size-4.5" />
          </div>
          <div>
            <DialogTitle className="text-base font-semibold text-foreground">
              Thêm tài liệu học tập mới
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hỗ trợ tệp đính kèm (PDF, Slide, Video, Word) hoặc liên kết ngoài.
            </p>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-3" noValidate>
            {!topicId && topics && topics.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Layers className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  Chủ đề bài học
                </label>
                <Select
                  value={selectedTopicId}
                  onValueChange={setSelectedTopicId}
                  disabled={isSubmitting || isUploading}
                >
                  <SelectTrigger className="cursor-pointer rounded-lg h-9 text-sm">
                    <SelectValue placeholder="Chọn chủ đề bài học..." />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((t) => (
                      <SelectItem key={t.id} value={t.id} className="cursor-pointer">
                        {t.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <FormField
              control={control}
              name="materialType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-foreground">
                    Định dạng tài liệu
                  </FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      removeFile();
                      setValue('externalUrl', '');
                    }}
                    value={field.value}
                    disabled={isSubmitting || isUploading}
                  >
                    <FormControl>
                      <SelectTrigger className="cursor-pointer rounded-lg h-9 text-sm">
                        <SelectValue placeholder="Chọn loại tài liệu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-lg">
                      <SelectItem value="pdf" className="cursor-pointer text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="size-3.5 text-red-500" />
                          <span>Tài liệu PDF</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="slide" className="cursor-pointer text-xs">
                        <div className="flex items-center gap-2">
                          <Presentation className="size-3.5 text-orange-500" />
                          <span>Bài thuyết trình / Slide</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="video" className="cursor-pointer text-xs">
                        <div className="flex items-center gap-2">
                          <Play className="size-3.5 text-blue-500" />
                          <span>Bài giảng Video</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="document" className="cursor-pointer text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="size-3.5 text-emerald-500" />
                          <span>Văn bản Word / DOCX</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="link" className="cursor-pointer text-xs">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="size-3.5 text-purple-500" />
                          <span>Liên kết ngoài (YouTube / Website)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-foreground">
                    Tiêu đề tài liệu <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        selectedFile
                          ? selectedFile.name
                          : 'VD: Giáo trình Chương 1: Kiến trúc Client-Server'
                      }
                      disabled={isSubmitting || isUploading}
                      className="rounded-lg h-9 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {currentType === 'link' ? (
              <FormField
                control={control}
                name="externalUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-foreground">
                      Đường dẫn liên kết (URL) <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/tai-lieu-tham-khao"
                        disabled={isSubmitting}
                        className="rounded-lg h-9 text-sm font-mono text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            ) : (
              <div className="space-y-1.5">
                <FormLabel className="text-xs font-medium text-foreground">
                  Tệp đính kèm <span className="text-destructive">*</span>
                </FormLabel>

                {fileUrl ? (
                  <div className="flex items-center justify-between border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/30 px-3.5 py-2.5 rounded-lg">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-xs font-medium text-emerald-900 dark:text-emerald-200 truncate">
                        {selectedFile ? selectedFile.name : 'Đã tải lên tệp tin'}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20 rounded-md cursor-pointer"
                      onClick={removeFile}
                      disabled={isSubmitting || isUploading}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-border/80 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors relative"
                  >
                    <input
                      type="file"
                      id="material-file-input"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isSubmitting || isUploading}
                    />
                    <label
                      htmlFor="material-file-input"
                      className="flex flex-col items-center justify-center cursor-pointer w-full text-center"
                    >
                      <UploadCloud className="size-8 text-muted-foreground mb-1.5" />
                      <p className="text-xs font-medium text-foreground">
                        Kéo thả tệp hoặc nhấp để chọn
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Chấp nhận tài liệu PDF, DOCX, Slide, Video (tối đa 50MB)
                      </p>
                    </label>

                    {isUploading && (
                      <div className="absolute inset-0 bg-background/90 backdrop-blur-xs flex flex-col items-center justify-center rounded-xl p-4">
                        <UploadCloud className="size-6 text-emerald-500 animate-bounce mb-1.5" />
                        <span className="text-xs font-medium text-foreground">
                          Đang tải lên MinIO... ({uploadProgress}%)
                        </span>
                        <div className="w-40 bg-muted h-1 rounded-full mt-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Hidden input to hold fileUrl for form validation */}
                <input type="hidden" {...control.register('fileUrl')} />
                <FormField
                  control={control}
                  name="fileUrl"
                  render={() => (
                    <FormItem>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </form>
        </Form>

        <DialogFooter className="gap-2 pt-2 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer rounded-lg text-xs h-8.5"
            onClick={handleClose}
            disabled={isSubmitting || isUploading}
          >
            Hủy
          </Button>
          <Button
            size="sm"
            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs h-8.5 px-4 font-medium"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? 'Đang lưu...' : 'Thêm tài liệu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
