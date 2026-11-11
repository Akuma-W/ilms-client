import type { ClassGradeMatrixRow } from '@/types/grade';

export type GradeSortField = 'index' | 'code' | 'name' | 'finalScore' | string;
export type GradeSortOrder = 'asc' | 'desc';

// Sorts classroom grade matrix rows based on selected field and direction
export function sortGradeRows(
  rows: ClassGradeMatrixRow[],
  sortField: GradeSortField,
  sortOrder: GradeSortOrder,
  draftScores?: Record<string, Record<string, number | null>>,
): ClassGradeMatrixRow[] {
  if (sortField === 'index') {
    return sortOrder === 'asc' ? [...rows] : [...rows].reverse();
  }

  return [...rows].sort((a, b) => {
    let comparison = 0;

    if (sortField === 'code') {
      comparison = a.studentCode.localeCompare(b.studentCode);
    } else if (sortField === 'name') {
      comparison = a.studentName.localeCompare(b.studentName, 'vi');
    } else if (sortField === 'finalScore') {
      const scoreA = a.finalScore;
      const scoreB = b.finalScore;

      if (scoreA === null && scoreB === null) comparison = 0;
      else if (scoreA === null) return 1;
      else if (scoreB === null) return -1;
      else comparison = scoreA - scoreB;
    } else {
      // Sorting by category ID
      const scoreA = draftScores?.[a.studentId]?.[sortField] ?? a.scores[sortField];
      const scoreB = draftScores?.[b.studentId]?.[sortField] ?? b.scores[sortField];

      if (scoreA === null && scoreB === null) comparison = 0;
      else if (scoreA === null) return 1;
      else if (scoreB === null) return -1;
      else comparison = (scoreA ?? 0) - (scoreB ?? 0);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}
