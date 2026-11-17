import z from 'zod';

export const createClassSchema = z.object({
  title: z
    .string()
    .min(3, 'Tiêu đề lớp học ít nhất 3 ký tự')
    .max(100, 'Tiêu đề không được vượt quá 100 ký tự'),

  subjectId: z.string().uuid('Vui lòng chọn môn học trực thuộc'),

  isPrivate: z.boolean(),

  maxStudents: z
    .number()
    .int('Sĩ số phải là số nguyên')
    .min(1, 'Sĩ số tối thiểu là 1 sinh viên')
    .max(500, 'Sĩ số tối đa là 500 sinh viên'),

  assistantIds: z.array(z.string().uuid()),

  description: z
    .string()
    .max(500, 'Mô tả không được vượt quá 500 ký tự')
    .optional()
    .or(z.literal('')),

  semester: z.string().max(50, 'Học kỳ không được vượt quá 50 ký tự').optional().or(z.literal('')),
});

export type CreateClassFormValues = z.infer<typeof createClassSchema>;
