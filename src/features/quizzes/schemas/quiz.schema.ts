import { z } from 'zod';

export const publishQuizSchema = z
  .object({
    quizId: z.string().min(1, 'Vui lòng chọn bài trắc nghiệm cần xuất bản'),
    topicId: z.string().optional().nullable(),
    openAt: z.string().min(1, 'Vui lòng chọn thời gian mở bài'),
    closeAt: z.string().min(1, 'Vui lòng chọn thời gian đóng bài'),
  })
  .refine(
    (data) => {
      if (!data.openAt || !data.closeAt) return true;
      return new Date(data.closeAt) > new Date(data.openAt);
    },
    {
      message: 'Thời gian đóng bài phải diễn ra sau thời gian mở bài',
      path: ['closeAt'],
    },
  );

export type PublishQuizFormData = z.infer<typeof publishQuizSchema>;
