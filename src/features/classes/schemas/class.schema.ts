import z from 'zod';

export const createClassSchema = z.object({
  title: z
    .string()
    .min(3, 'Tiêu đề lớp học ít nhất 3 ký tự')
    .max(100, 'Tiêu đề không được vượt quá 100 ký tự'),

  subject: z
    .string()
    .min(3, 'Môn học ít nhất 3 ký tự')
    .max(100, 'Tên môn học không được vượt quá 100 ký tự'),

  isPrivate: z.boolean(),

  description: z
    .string()
    .max(500, 'Mô tả không được vượt quá 500 ký tự')
    .optional()
    .or(z.literal('')),

  semester: z.string().max(50, 'Học kỳ không được vượt quá 50 ký tự').optional().or(z.literal('')),
});

export type CreateClassFormValues = z.infer<typeof createClassSchema>;
