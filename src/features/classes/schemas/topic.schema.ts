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

export const createMaterialSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Tiêu đề tài liệu ít nhất 3 ký tự')
      .max(100, 'Tiêu đề không được vượt quá 100 ký tự'),
    materialType: z.enum(['video', 'pdf', 'link', 'slide', 'document'] as const, {
      message: 'Vui lòng chọn loại tài liệu hợp lệ',
    }),
    fileUrl: z.string().optional(),
    externalUrl: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.materialType === 'link') {
        return !!data.externalUrl && data.externalUrl.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Đường dẫn liên kết ngoài là bắt buộc đối với loại tài liệu link',
      path: ['externalUrl'],
    },
  )
  .refine(
    (data) => {
      if (data.materialType !== 'link') {
        return !!data.fileUrl && data.fileUrl.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Tệp tin đính kèm là bắt buộc',
      path: ['fileUrl'],
    },
  );

export type CreateMaterialFormValues = z.infer<typeof createMaterialSchema>;
