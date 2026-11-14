import { clientApiClient } from '@/lib/api/client-api-client';
import type {
  PublishQuizInput,
  QuizClassItem,
  QuizPublication,
  UpdatePublicationInput,
} from '@/types/quiz';
import { mapQuizPublicationToClassItem, normalizeQuizPublications } from '../utils/quiz.utils';

export const quizPublicationsService = {
  // Retrieves list of quizzes published in a specific classroom
  async getClassPublications(classId: string): Promise<QuizClassItem[]> {
    const res = await clientApiClient<QuizPublication[]>(`/classes/${classId}/quizzes`);
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể tải bài thi của lớp');
    }

    return normalizeQuizPublications(res.data)
      .map((publication) => mapQuizPublicationToClassItem(publication, classId))
      .filter((quiz): quiz is QuizClassItem => quiz !== null);
  },

  // Publishes an existing quiz from repository into a classroom
  async publishQuiz(
    classId: string,
    input: PublishQuizInput,
  ): Promise<{ success: boolean; data: QuizPublication; message: string }> {
    const { quizId, ...publicationInput } = input;
    const { topicId, ...schedule } = publicationInput;
    const res = await clientApiClient<QuizPublication>(`/quizzes/${quizId}/publications`, {
      method: 'POST',
      body: JSON.stringify({
        ...schedule,
        classId,
        ...(topicId ? { topicId } : {}),
      }),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể xuất bản bài thi vào lớp');
    }
    return {
      success: true,
      data: res.data,
      message: res.message || 'Xuất bản bài thi vào lớp thành công!',
    };
  },

  // Updates publication schedule, topic or visibility
  async updatePublication(
    publicationId: string,
    input: UpdatePublicationInput,
  ): Promise<QuizPublication> {
    const res = await clientApiClient<QuizPublication>(`/quiz-publications/${publicationId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể cập nhật đợt thi');
    }
    return res.data;
  },

  // Unpublishes / deletes a quiz publication from a class
  async deletePublication(publicationId: string): Promise<{ success: boolean; message: string }> {
    const res = await clientApiClient<unknown>(`/quiz-publications/${publicationId}`, {
      method: 'DELETE',
    });
    if (!res || res.success === false) {
      throw new Error(res?.message || 'Không thể gỡ bài thi khỏi lớp');
    }
    return {
      success: true,
      message: res.message || 'Gỡ bài thi khỏi lớp học thành công',
    };
  },

  async unpublishQuiz(publicationId: string): Promise<{ success: boolean; message: string }> {
    return this.deletePublication(publicationId);
  },
};
