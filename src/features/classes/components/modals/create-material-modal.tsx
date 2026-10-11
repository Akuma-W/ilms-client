// 'use client';

// import { FileText, Link as LinkIcon, Paperclip, Play, Presentation, UploadCloud, X } from 'lucide-react';
// import { useId, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from 'sonner';
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { CreateMaterialFormValues, createMaterialSchema } from '../../schemas/topic.schema';
// import { materialsService } from '../../services/materials.service';
// import { FileType } from '@/types/enum';

// interface CreateMaterialModalProps {
//   topicId: string;
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSuccess: () => void;
// }

// const DEFAULT_VALUES = {
//   title: '',
//   materialType: 'pdf' as FileType,
//   fileUrl: '',
//   externalUrl: '',
// };

// export function CreateMaterialModal({
//   topicId,
//   isOpen,
//   onOpenChange,
//   onSuccess,
// }: CreateMaterialModalProps) {
//   const formId = useId();
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   const form = useForm<CreateMaterialFormValues>({
//     resolver: zodResolver(createMaterialSchema),
//     defaultValues: DEFAULT_VALUES,
//   });

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     formState: { isSubmitting },
//   } = form;

//   const currentType = watch('materialType');
//   const fileUrl = watch('fileUrl');

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       await uploadSelectedFile(files[0]);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//   };

//   const handleDrop = async (e: React.DragEvent) => {
//     e.preventDefault();
//     const files = e.dataTransfer.files;
//     if (files && files.length > 0) {
//       await uploadSelectedFile(files[0]);
//     }
//   };

//   const uploadSelectedFile = async (file: File) => {
//     setSelectedFile(file);
//     setIsUploading(true);
//     setUploadProgress(20);

//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       setUploadProgress(50);
//       const res = await materialsService.uploadFile(formData);
//       setUploadProgress(85);

//       if (!res.success || !res.data) {
//         throw new Error(res.message || 'Tải lên tệp thất bại');
//       }

//       const fileUrlResult = res.data.url;
//       setValue('fileUrl', fileUrlResult, { shouldValidate: true });
      
//       // Auto-populate title if empty
//       const currentTitle = form.getValues('title');
//       if (!currentTitle) {
//         const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
//         setValue('title', nameWithoutExt, { shouldValidate: true });
//       }

//       setUploadProgress(100);
//       toast.success('Tải lên tệp thành công!');
//     } catch (error) {
//       setSelectedFile(null);
//       setValue('fileUrl', '');
//       toast.error('Lỗi khi tải lên tệp tin', {
//         description: error instanceof Error ? error.message : 'Vui lòng thử lại.',
//       });
//     } finally {
//       setIsUploading(false);
//       setTimeout(() => setUploadProgress(0), 1000);
//     }
//   };

//   const onSubmit = async (values: CreateMaterialFormValues) => {
//     try {
//       const payload = {
//         title: values.title,
//         materialType: values.materialType,
//         fileUrl: values.materialType !== 'link' ? values.fileUrl : undefined,
//         externalUrl: values.materialType === 'link' ? values.externalUrl : undefined,
//       };

//       const res = await materialsService.createMaterial(topicId, payload);

//       if (!res.success) {
//         throw new Error(res.message || 'Tạo tài liệu thất bại');
//       }

//       toast.success('Thêm tài liệu thành công!');
//       onSuccess();
//       handleClose();
//     } catch (error) {
//       toast.error('Thêm tài liệu thất bại', {
//         description: error instanceof Error ? error.message : 'Vui lòng thử lại.',
//       });
//     }
//   };

//   const handleClose = () => {
//     if (isSubmitting || isUploading) return;
//     onOpenChange(false);
//     reset(DEFAULT_VALUES);
//     setSelectedFile(null);
//   };

//   const removeFile = () => {
//     setSelectedFile(null);
//     setValue('fileUrl', '', { shouldValidate: true });
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent
//         className="sm:max-w-130"
//         onInteractOutside={(e) => (isSubmitting || isUploading) && e.preventDefault()}
//         onEscapeKeyDown={(e) => (isSubmitting || isUploading) && e.preventDefault()}
//       >
//         <DialogHeader>
//           <DialogTitle className="text-xl font-bold text-galaxy-blue flex items-center gap-2">
//             <Paperclip className="h-5 w-5 text-purple-600" />
//             Thêm tài liệu học tập mới
//           </DialogTitle>
//         </DialogHeader>

//         <Form {...form}>
//           <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2" noValidate>
//             <FormField
//               control={control}
//               name="materialType"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Loại tài liệu</FormLabel>
//                   <Select
//                     onValueChange={(v) => {
//                       field.onChange(v);
//                       removeFile();
//                       setValue('externalUrl', '');
//                     }}
//                     value={field.value}
//                     disabled={isSubmitting || isUploading}
//                   >
//                     <FormControl>
//                       <SelectTrigger className="cursor-pointer">
//                         <SelectValue placeholder="Chọn loại tài liệu" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="pdf" className="cursor-pointer">
//                         <div className="flex items-center gap-2">
//                           <FileText className="h-4 w-4 text-red-500" />
//                           Tài liệu PDF
//                         </div>
//                       </SelectItem>
//                       <SelectItem value="slide" className="cursor-pointer">
//                         <div className="flex items-center gap-2">
//                           <Presentation className="h-4 w-4 text-orange-500" />
//                           Bài thuyết trình / Slide
//                         </div>
//                       </SelectItem>
//                       <SelectItem value="video" className="cursor-pointer">
//                         <div className="flex items-center gap-2">
//                           <Play className="h-4 w-4 text-blue-500" />
//                           Bài giảng Video
//                         </div>
//                       </SelectItem>
//                       <SelectItem value="document" className="cursor-pointer">
//                         <div className="flex items-center gap-2">
//                           <FileText className="h-4 w-4 text-emerald-500" />
//                           Tài liệu văn bản (Word/Doc)
//                         </div>
//                       </SelectItem>
//                       <SelectItem value="link" className="cursor-pointer">
//                         <div className="flex items-center gap-2">
//                           <LinkIcon className="h-4 w-4 text-purple-500" />
//                           Liên kết ngoài (YouTube/Website)
//                         </div>
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     Tiêu đề tài liệu <span className="text-red-500">*</span>
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder={
//                         selectedFile
//                           ? 'Sử dụng tên tệp hoặc nhập tiêu đề mới'
//                           : 'VD: Giáo trình Lập trình mạng nâng cao'
//                       }
//                       disabled={isSubmitting || isUploading}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {currentType === 'link' ? (
//               <FormField
//                 control={control}
//                 name="externalUrl"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>
//                       Liên kết ngoài <span className="text-red-500">*</span>
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="https://example.com/tai-lieu-tham-khao"
//                         disabled={isSubmitting}
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             ) : (
//               <div className="space-y-2">
//                 <FormLabel>
//                   Tệp đính kèm <span className="text-red-500">*</span>
//                 </FormLabel>

//                 {fileUrl ? (
//                   <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50/50 p-3 rounded-lg">
//                     <div className="flex items-center gap-2 truncate">
//                       <FileText className="h-5 w-5 text-emerald-600 shrink-0" />
//                       <span className="text-sm font-medium text-emerald-800 truncate">
//                         {selectedFile ? selectedFile.name : 'Đã tải lên tệp tin'}
//                       </span>
//                     </div>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 text-emerald-800 hover:bg-emerald-100"
//                       onClick={removeFile}
//                       disabled={isSubmitting || isUploading}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ) : (
//                   <div
//                     onDragOver={handleDragOver}
//                     onDrop={handleDrop}
//                     className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative"
//                   >
//                     <input
//                       type="file"
//                       id="material-file"
//                       className="hidden"
//                       onChange={handleFileChange}
//                       disabled={isSubmitting || isUploading}
//                     />
//                     <label
//                       htmlFor="material-file"
//                       className="flex flex-col items-center justify-center cursor-pointer w-full"
//                     >
//                       <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
//                       <p className="text-sm font-semibold text-gray-700">Kéo thả tệp hoặc nhấp để chọn</p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         Chấp nhận các tệp văn bản, video, pdf lên tới 50MB
//                       </p>
//                     </label>

//                     {isUploading && (
//                       <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center rounded-xl p-4">
//                         <UploadCloud className="h-8 w-8 text-blue-500 animate-bounce mb-2" />
//                         <span className="text-sm font-medium text-gray-700">
//                           Đang tải lên hệ thống MinIO... ({uploadProgress}%)
//                         </span>
//                         <div className="w-48 bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
//                           <div
//                             className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
//                             style={{ width: `${uploadProgress}%` }}
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {/* Hidden input to hold fileUrl for form validation */}
//                 <input type="hidden" {...control.register('fileUrl')} />
//                 <FormField
//                   control={control}
//                   name="fileUrl"
//                   render={() => (
//                     <FormItem>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             )}
//           </form>
//         </Form>

//         <DialogFooter className="mt-4">
//           <Button variant="outline" className="cursor-pointer" onClick={handleClose} disabled={isSubmitting || isUploading}>
//             Hủy
//           </Button>
//           <Button
//             className="cursor-pointer bg-galaxy text-white"
//             onClick={handleSubmit(onSubmit)}
//             disabled={isSubmitting || isUploading}
//           >
//             {isSubmitting ? 'Đang lưu...' : 'Thêm tài liệu'}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
