import z from 'zod';

export const materialItemSchema = z.object({
  title: z
    .string()
    .min(1, 'Tiêu đề tài liệu không được để trống')
    .max(150, 'Tiêu đề không được vượt quá 150 ký tự'),
  materialType: z.enum(['video', 'pdf', 'link', 'slide', 'document'] as const),
  fileUrl: z.string().optional(),
  externalUrl: z.string().optional(),
});

export type MaterialItemValues = z.infer<typeof materialItemSchema>;
