// 'use client';

// import { Plus } from 'lucide-react';
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
//   DialogTrigger,
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
// import { Textarea } from '@/components/ui/textarea';
// import { CreateTopicFormValues, createTopicSchema } from '../../schemas/topic.schema';
// import { topicsService } from '../../services/topics.service';

// interface CreateTopicModalProps {
//   classId: string;
//   onSuccess: () => void;
// }

// const DEFAULT_VALUES = {
//   title: '',
//   description: '',
// };

// export function CreateTopicModal({ classId, onSuccess }: CreateTopicModalProps) {
//   const formId = useId();
//   const [isOpen, setIsOpen] = useState(false);

//   const form = useForm<CreateTopicFormValues>({
//     resolver: zodResolver(createTopicSchema),
//     defaultValues: DEFAULT_VALUES,
//   });

//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { isSubmitting },
//   } = form;

//   const onSubmit = async (values: CreateTopicFormValues) => {
//     try {
//       const res = await topicsService.createTopic(classId, {
//         title: values.title,
//         description: values.description || undefined,
//       });

//       if (!res.success) {
//         throw new Error(res.message || 'Tạo bài giảng thất bại');
//       }

//       toast.success('Tạo bài giảng thành công!');
//       onSuccess();
//       handleOpenChange(false);
//     } catch (error) {
//       const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra, vui lòng thử lại.';
//       toast.error('Tạo bài giảng thất bại', { description: message });
//     }
//   };

//   const handleOpenChange = (open: boolean) => {
//     if (isSubmitting) return;
//     setIsOpen(open);

//     if (!open) {
//       setTimeout(() => reset(DEFAULT_VALUES), 150);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleOpenChange}>
//       <DialogTrigger asChild>
//         <Button className="cursor-pointer bg-galaxy hover:opacity-95 text-white h-10 px-5 shadow-md shadow-blue-500/10">
//           <Plus className="w-4 h-4 mr-2" />
//           Thêm bài giảng mới
//         </Button>
//       </DialogTrigger>

//       <DialogContent
//         className="sm:max-w-120"
//         onInteractOutside={(e) => isSubmitting && e.preventDefault()}
//         onEscapeKeyDown={(e) => isSubmitting && e.preventDefault()}
//       >
//         <DialogHeader>
//           <DialogTitle className="text-xl font-bold text-galaxy-blue">Tạo bài giảng / Chuyên đề mới</DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2" noValidate>
//             <FormField
//               control={control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     Tiêu đề bài giảng <span className="text-red-500">*</span>
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="VD: Chương 1: Tổng quan và Lịch sử phát triển"
//                       disabled={isSubmitting}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Mô tả ngắn (Tùy chọn)</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Mô tả nội dung chính hoặc mục tiêu của bài giảng học phần này..."
//                       rows={3}
//                       className="resize-none"
//                       disabled={isSubmitting}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </form>
//         </Form>
//         <DialogFooter>
//           <Button variant="outline" className="cursor-pointer" onClick={() => handleOpenChange(false)}>
//             Hủy
//           </Button>
//           <Button className="cursor-pointer bg-galaxy text-white" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
//             {isSubmitting ? 'Đang tạo...' : 'Tạo mới'}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
