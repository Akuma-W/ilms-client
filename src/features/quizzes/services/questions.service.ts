import { clientApiClient } from '@/lib/api/client-api-client';
import type { CreateQuestionInput, ParsedQuestion, Question } from '@/types/quiz';
import { normalizeQuizArray } from '../utils/quiz.utils';

export const questionsService = {
  // Creates a single question under a quiz
  async createQuestion(quizId: string, input: CreateQuestionInput): Promise<Question> {
    const res = await clientApiClient<Question>(`/quizzes/${quizId}/questions`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể tạo câu hỏi mới');
    }
    return res.data;
  },

  // Batch creates multiple questions (used after Word import or bulk additions)
  async batchCreateQuestions(quizId: string, input: CreateQuestionInput[]): Promise<Question[]> {
    const res = await clientApiClient<Question[]>(`/quizzes/${quizId}/questions/batch`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể lưu danh sách câu hỏi hàng loạt');
    }
    return normalizeQuizArray<Question>(res.data);
  },

  // Updates an existing question and replaces its options
  async updateQuestion(id: string, input: Partial<CreateQuestionInput>): Promise<Question> {
    const res = await clientApiClient<Question>(`/questions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể cập nhật câu hỏi');
    }
    return res.data;
  },

  // Deletes a question and its options
  async deleteQuestion(id: string): Promise<{ success: boolean; message: string }> {
    const res = await clientApiClient<unknown>(`/questions/${id}`, {
      method: 'DELETE',
    });
    if (!res || res.success === false) {
      throw new Error(res?.message || 'Không thể xóa câu hỏi');
    }
    return {
      success: true,
      message: res.message || 'Xóa câu hỏi thành công',
    };
  },

  // Reorders questions inside a quiz
  async reorderQuestions(
    quizId: string,
    orders: { questionId: string; orderIndex: number }[],
  ): Promise<Question[]> {
    const res = await clientApiClient<Question[]>(`/quizzes/${quizId}/questions/reorder`, {
      method: 'PATCH',
      body: JSON.stringify({ orders }),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể thay đổi thứ tự câu hỏi');
    }
    return normalizeQuizArray<Question>(res.data);
  },

  // Synchronizes question creation, edits, deletions and order for an existing quiz
  async syncQuizQuestions(
    quizId: string,
    questions: ParsedQuestion[],
    initialQuestionIds: string[],
  ): Promise<Question[]> {
    const currentIds = new Set(questions.flatMap((question) => (question.id ? [question.id] : [])));
    const existingIds = new Set(initialQuestionIds);
    const savedQuestions = await Promise.all(
      questions.map((question, index) => {
        const input: CreateQuestionInput = {
          content: question.content,
          questionType: question.questionType,
          points: question.points,
          orderIndex: index + 1,
          explanation: question.explanation,
          options: question.options,
        };

        if (question.id && existingIds.has(question.id)) {
          return this.updateQuestion(question.id, input);
        }
        return this.createQuestion(quizId, input);
      }),
    );

    const reorderedQuestions = await this.reorderQuestions(
      quizId,
      savedQuestions.map((question, index) => ({
        questionId: question.id,
        orderIndex: index + 1,
      })),
    );

    for (const questionId of initialQuestionIds) {
      if (!currentIds.has(questionId)) {
        await this.deleteQuestion(questionId);
      }
    }

    return reorderedQuestions.filter((question) => currentIds.has(question.id));
  },
};
