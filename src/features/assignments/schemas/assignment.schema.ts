import { z } from 'zod';
import { FileType } from '@/types/enum';

export const assignmentMaterialSchema = z.object({
  fileUrl: z.string().min(1, 'Đường dẫn tệp không được để trống'),
  fileType: z.nativeEnum(FileType).nullable().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
});

export const assignmentFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Tiêu đề bài tập phải có ít nhất 3 ký tự')
    .max(200, 'Tiêu đề bài tập không được vượt quá 200 ký tự'),
  description: z.string().optional(),
  dueAt: z.string().min(1, 'Vui lòng chọn thời gian hạn chót nộp bài'),
  maxScore: z
    .number()
    .min(1, 'Điểm tối đa phải lớn hơn 0')
    .max(100, 'Điểm tối đa không vượt quá 100'),
  topicId: z.string().optional(),
  materials: z.array(assignmentMaterialSchema).optional(),
});

export type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;
