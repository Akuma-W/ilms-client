import type { ParsedQuestion, QuizClassItem, QuizPublication } from '@/types/quiz';
import { QuestionType } from '@/types/enum';

export function normalizeQuizPublications(data: unknown): QuizPublication[] {
  return normalizeQuizArray<QuizPublication>(data);
}

export function normalizeQuizArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    return Object.values(data as Record<string, T>);
  }
  return [];
}

export function formatDateTimeLocal(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

/**
 * Formats ISO date string to readable format with full 4-digit year.
 * Example: "08:00 10/11/2026"
 */
export function formatQuizDateTime(dateString?: string | null): string {
  if (!dateString) return 'Chưa xác định';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    const time = d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const date = d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return `${time} ${date}`;
  } catch {
    return String(dateString);
  }
}

function normalizeDateTime(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function mapQuizPublicationToClassItem(
  publication: QuizPublication,
  fallbackClassId: string,
): QuizClassItem | null {
  if (!publication.quiz) return null;

  return {
    id: publication.quiz.id,
    publicationId: publication.id,
    classId: publication.classId ?? fallbackClassId,
    title: publication.quiz.title,
    description: publication.quiz.description,
    timeLimit: publication.quiz.timeLimit,
    totalQuestions: publication.quiz.totalQuestions ?? publication.quiz._count?.questions,
    questionCount: publication.quiz.totalQuestions ?? publication.quiz._count?.questions,
    totalPoints: publication.quiz.totalPoints,
    topicId: publication.topicId,
    topicName: publication.topic?.title ?? null,
    openAt: normalizeDateTime(publication.openAt),
    closeAt: normalizeDateTime(publication.closeAt),
    submittedCount: publication.submittedCount,
    totalStudents: publication.totalStudents,
    currentUserAttempt: publication.latestUserAttempt,
  };
}

export function getQuizQuestionValidationError(question: ParsedQuestion): string | null {
  if (!question.content.trim()) return 'Chưa có nội dung câu hỏi';
  if (!Number.isFinite(question.points) || question.points <= 0) {
    return 'Điểm số phải lớn hơn 0';
  }
  if (question.options.length < 2) return 'Cần ít nhất hai phương án';
  if (question.options.some((option) => !option.content.trim())) {
    return 'Không để trống nội dung phương án';
  }

  const correctCount = question.options.filter((option) => option.isCorrect).length;
  if (question.questionType === QuestionType.multiple_choice && correctCount !== 1) {
    return 'Câu hỏi một đáp án phải có đúng một đáp án đúng';
  }
  if (question.questionType === QuestionType.multiple_select && correctCount === 0) {
    return 'Câu hỏi nhiều đáp án phải có ít nhất một đáp án đúng';
  }
  if (question.questionType === QuestionType.true_false) {
    if (question.options.length !== 2) return 'Câu đúng/sai phải có đúng hai phương án';
    if (correctCount !== 1) return 'Câu đúng/sai phải có đúng một đáp án đúng';
  }

  return null;
}

export function changeParsedQuestionType(
  question: ParsedQuestion,
  questionType: QuestionType,
): ParsedQuestion {
  if (questionType === QuestionType.true_false) {
    // Stash choice options so user does not lose typed options when switching back
    const choiceOptions =
      question.questionType !== QuestionType.true_false
        ? question.options
        : question.choiceOptions;

    return {
      ...question,
      questionType,
      choiceOptions,
      options: [
        { content: 'Đúng', isCorrect: true },
        { content: 'Sai', isCorrect: false },
      ],
    };
  }

  // If transitioning from true_false back to choice type
  let options = question.options.map((opt) => ({ ...opt }));
  if (question.questionType === QuestionType.true_false) {
    if (question.choiceOptions && question.choiceOptions.length >= 2) {
      options = question.choiceOptions.map((opt) => ({ ...opt }));
    } else {
      options = [
        { content: '', isCorrect: true },
        { content: '', isCorrect: questionType === QuestionType.multiple_select },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
      ];
    }
  }

  // Ensure at least 4 options for choice questions
  while (options.length < 4) {
    options.push({ content: '', isCorrect: false });
  }

  if (questionType === QuestionType.multiple_choice) {
    // Exactly 1 correct answer
    let hasCorrect = false;
    options = options.map((opt) => {
      if (opt.isCorrect && !hasCorrect) {
        hasCorrect = true;
        return opt;
      }
      return { ...opt, isCorrect: false };
    });
    if (!hasCorrect && options.length > 0) {
      options[0] = { ...options[0], isCorrect: true };
    }
  } else if (questionType === QuestionType.multiple_select) {
    // At least 2 correct answers by default
    const currentCorrectCount = options.filter((o) => o.isCorrect).length;
    if (currentCorrectCount < 2 && options.length >= 2) {
      options = options.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === 0 || idx === 1 || opt.isCorrect,
      }));
    }
  }

  return { ...question, questionType, options };
}

type QuizDisplayStatus =
  | 'not_submitted_open'
  | 'submitted_open'
  | 'submitted_closed'
  | 'not_submitted_closed'
  | 'upcoming';

/**
 * Determines the display state based on student submission and deadlines.
 */
export function getQuizDisplayStatus(
  quiz: QuizClassItem,
  now: Date = new Date(),
): QuizDisplayStatus {
  const parsedOpenTime = quiz.openAt ? new Date(quiz.openAt).getTime() : Number.NEGATIVE_INFINITY;
  const parsedCloseTime = quiz.closeAt
    ? new Date(quiz.closeAt).getTime()
    : Number.POSITIVE_INFINITY;
  const openTime = Number.isNaN(parsedOpenTime) ? Number.NEGATIVE_INFINITY : parsedOpenTime;
  const closeTime = Number.isNaN(parsedCloseTime) ? Number.POSITIVE_INFINITY : parsedCloseTime;
  const currentTime = now.getTime();
  const isSubmitted = Boolean(quiz.currentUserAttempt?.submittedAt);

  if (isSubmitted) {
    return currentTime <= closeTime ? 'submitted_open' : 'submitted_closed';
  }

  if (Number.isFinite(openTime) && currentTime < openTime) {
    return 'upcoming';
  }

  if (currentTime <= closeTime) {
    return 'not_submitted_open';
  }

  return 'not_submitted_closed';
}

/**
 * Generates the standardized time row text
 */
export function getQuizTimeRowText(quiz: QuizClassItem, now: Date = new Date()): string {
  const status = getQuizDisplayStatus(quiz, now);
  const openFormatted = quiz.openAt ? formatQuizDateTime(quiz.openAt) : 'Mở ngay';
  const closeFormatted = quiz.closeAt ? formatQuizDateTime(quiz.closeAt) : 'Không hạn nộp';
  const submittedFormatted = formatQuizDateTime(quiz.currentUserAttempt?.submittedAt);

  switch (status) {
    case 'not_submitted_open':
    case 'upcoming':
      return `${openFormatted} - ${closeFormatted}`;

    case 'submitted_open':
      return `Đã nộp lúc: ${submittedFormatted} - Đóng: ${closeFormatted}`;

    case 'submitted_closed':
      return `Đã nộp lúc: ${submittedFormatted} - Đã đóng`;

    case 'not_submitted_closed':
      return `Quá hạn nộp - Đã đóng (${closeFormatted})`;

    default:
      return `${openFormatted} - ${closeFormatted}`;
  }
}
