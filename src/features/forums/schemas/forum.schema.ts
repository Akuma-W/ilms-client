import { z } from 'zod';

export const createForumSchema = z.object({
  title: z
    .string()
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự.')
    .max(200, 'Tiêu đề không được vượt quá 200 ký tự.'),
  content: z
    .string()
    .min(5, 'Nội dung phải có ít nhất 5 ký tự.')
    .max(5000, 'Nội dung không được vượt quá 5000 ký tự.'),
  isAnonymous: z.boolean(),
});

export type CreateForumFormData = z.infer<typeof createForumSchema>;

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Nội dung bình luận không được để trống.')
    .max(2000, 'Bình luận không được vượt quá 2000 ký tự.'),
  isAnonymous: z.boolean(),
  parentId: z.string().nullable().optional(),
});

export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
