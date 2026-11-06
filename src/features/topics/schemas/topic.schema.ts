import z from 'zod';

export const createTopicSchema = z.object({
  title: z
    .string()
    .min(3, 'Tiêu đề bài giảng ít nhất 3 ký tự')
    .max(100, 'Tiêu đề không được vượt quá 100 ký tự'),
  description: z
    .string()
    .max(500, 'Mô tả không được vượt quá 500 ký tự')
    .optional()
    .or(z.literal('')),
});

export type CreateTopicFormValues = z.infer<typeof createTopicSchema>;
