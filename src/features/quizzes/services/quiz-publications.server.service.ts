import { serverApiClient } from '@/lib/api/server-api-client';
import { getMockClassQuizzes } from '@/mocks/classes/mock-quizzes';
import type { QuizClassItem, QuizPublication } from '@/types/quiz';
import { mapQuizPublicationToClassItem, normalizeQuizPublications } from '../utils/quiz.utils';

export const quizPublicationsServerService = {
  // Fetches quiz publications for a classroom during SSR
  async getClassPublications(classId: string): Promise<QuizClassItem[]> {
    try {
      const res = await serverApiClient<QuizPublication[]>(`/classes/${classId}/quizzes`, {
        ignoreAuthError: true,
      });
      if (res && res.success !== false && res.data) {
        return normalizeQuizPublications(res.data)
          .map((publication) => mapQuizPublicationToClassItem(publication, classId))
          .filter((quiz): quiz is QuizClassItem => quiz !== null);
      }
    } catch {
      return getMockClassQuizzes(classId);
    }

    return getMockClassQuizzes(classId);
  },

  // Fetches a single quiz publication by ID during SSR
  async getPublicationById(publicationId: string): Promise<QuizPublication | null> {
    try {
      const res = await serverApiClient<QuizPublication>(`/quiz-publications/${publicationId}`, {
        ignoreAuthError: true,
      });
      if (res && res.success !== false && res.data) {
        return res.data;
      }
    } catch {
      return null;
    }
    return null;
  },
};
