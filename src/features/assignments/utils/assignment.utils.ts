import type { Assignment, Submission } from '@/types/assignment';

export interface DeadlineInfo {
  label: string;
  statusText: string;
  dueText: string;
  status: 'none' | 'overdue' | 'urgent' | 'normal' | 'submitted';
  badgeClass: string;
  isUrgent?: boolean;
  isOverdue?: boolean;
  isSubmitted?: boolean;
}

/**
 * Calculates deadline proximity and visual badge styling based on 4 distinct color states:
 * 1. Green: Submitted early / on time
 * 2. Red: Submission overdue
 * 3. Rose: Not submitted (<= 24 hours)
 * 4. Yellow: Not submitted (> 24 hours)
 */
export function getDeadlineInfo(
  dueAt?: string | null,
  submission?: Submission | null,
): DeadlineInfo {
  // Case 1: Student has already submitted
  if (submission) {
    const statusText = submission.isLate ? 'Đã nộp trễ' : 'Đã nộp đúng hạn';
    const dueText = dueAt
      ? `Hạn: ${formatAssignmentDate(dueAt)}`
      : `Nộp: ${formatAssignmentDate(submission.submittedAt)}`;
    if (submission.isLate) {
      return {
        label: `${statusText} (${dueText})`,
        statusText,
        dueText,
        status: 'overdue',
        isOverdue: true,
        isSubmitted: true,
        badgeClass:
          'bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-200 border-red-400 font-bold',
      };
    }
    return {
      label: `${statusText} (${dueText})`,
      statusText,
      dueText,
      status: 'submitted',
      isSubmitted: true,
      badgeClass:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-semibold',
    };
  }

  if (!dueAt) {
    return {
      label: 'Không có thời hạn',
      statusText: 'Không có thời hạn',
      dueText: 'Không giới hạn thời gian',
      status: 'none',
      badgeClass: 'bg-muted text-muted-foreground border-border',
    };
  }

  const dueDate = new Date(dueAt);
  if (isNaN(dueDate.getTime())) {
    return {
      label: 'Thời hạn không xác định',
      statusText: 'Thời hạn không xác định',
      dueText: 'Chưa xác định',
      status: 'none',
      badgeClass: 'bg-muted text-muted-foreground border-border',
    };
  }

  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const dueFormatted = `Hạn: ${formatAssignmentDate(dueAt)}`;

  // Case 2: Overdue
  if (diffMs < 0) {
    return {
      label: `Quá hạn nộp (${dueFormatted})`,
      statusText: 'Quá hạn nộp',
      dueText: dueFormatted,
      status: 'overdue',
      isOverdue: true,
      badgeClass:
        'bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-200 border-red-400 font-bold',
    };
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  // Case 3: Less than 24h remaining
  if (diffHours < 24) {
    const statusText = diffHours === 0 ? 'Còn dưới 1 giờ' : `Còn ${diffHours} giờ`;
    return {
      label: `${statusText} (${dueFormatted})`,
      statusText,
      dueText: dueFormatted,
      status: 'urgent',
      isUrgent: true,
      badgeClass:
        'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 font-medium',
    };
  }

  // Case 4: More than 24h remaining
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const statusText = `Còn ${diffDays} ngày`;
  return {
    label: `${statusText} (${dueFormatted})`,
    statusText,
    dueText: dueFormatted,
    status: 'normal',
    badgeClass:
      'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 font-medium',
  };
}

/**
 * Formats ISO date string to Vietnamese friendly format (HH:mm DD/MM/YYYY).
 */
export function formatAssignmentDate(dateStr?: string | Date | null): string {
  if (!dateStr) return '';
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  } catch {
    return '';
  }
}

/**
 * Extracts submission details for a specific student.
 */
export function getStudentSubmission(
  assignment?: Assignment | null,
  studentId?: string,
): Submission | undefined {
  if (!assignment || !assignment.submissions || !studentId) return undefined;
  return assignment.submissions.find((s) => s.studentId === studentId);
}

/**
 * Returns default assignment deadline (today at 23:59).
 */
export function getDefaultDueAt(): string {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}T23:59`;
}

/**
 * Formats ISO date string to datetime-local input format (YYYY-MM-DDTHH:mm).
 */
export function formatIsoForDatetimeInput(isoStr?: string | null): string {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}
