import type { QuizClassItem } from '@/types/quiz';

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

export type QuizDisplayStatus =
  | 'not_submitted_open' // Chưa làm (còn trong hạn)
  | 'submitted_open' // Đã làm còn giờ
  | 'submitted_closed' // Đã làm hết hạn
  | 'not_submitted_closed' // Chưa làm hết hạn (quá hạn)
  | 'upcoming'; // Sắp diễn ra

/**
 * Determines the display state based on student submission and deadlines.
 */
export function getQuizDisplayStatus(
  quiz: QuizClassItem,
  now: Date = new Date(),
): QuizDisplayStatus {
  const openTime = new Date(quiz.openAt).getTime();
  const closeTime = new Date(quiz.closeAt).getTime();
  const currentTime = now.getTime();
  const isSubmitted = Boolean(quiz.currentUserAttempt?.submittedAt);

  if (isSubmitted) {
    return currentTime <= closeTime ? 'submitted_open' : 'submitted_closed';
  }

  if (currentTime < openTime) {
    return 'upcoming';
  }

  if (currentTime <= closeTime) {
    return 'not_submitted_open';
  }

  return 'not_submitted_closed';
}

/**
 * Generates the standardized time row text following the user's 4 business rules:
 * 1. Chưa làm: Thời gian mở - Thời gian đóng.
 * 2. Đã làm còn giờ: Đã nộp lúc <giờ> - Thời gian đóng.
 * 3. Đã làm hết hạn: Đã nộp lúc <giờ> - Đã đóng.
 * 4. Chưa làm hết hạn: Quá hạn nộp - Đã đóng.
 */
export function getQuizTimeRowText(quiz: QuizClassItem, now: Date = new Date()): string {
  const status = getQuizDisplayStatus(quiz, now);
  const openFormatted = formatQuizDateTime(quiz.openAt);
  const closeFormatted = formatQuizDateTime(quiz.closeAt);
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
