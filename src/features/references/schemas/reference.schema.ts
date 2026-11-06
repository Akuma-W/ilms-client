import z from 'zod';

export const referenceItemSchema = z.object({
  title: z
    .string()
    .min(1, 'Tiêu đề tài liệu không được để trống')
    .max(150, 'Tiêu đề không được vượt quá 150 ký tự'),
  url: z.string().min(1, 'Đường dẫn tệp hoặc liên kết không được để trống'),
  description: z
    .string()
    .max(500, 'Ghi chú không được vượt quá 500 ký tự')
    .optional()
    .or(z.literal('')),
});

export type ReferenceItemValues = z.infer<typeof referenceItemSchema>;
