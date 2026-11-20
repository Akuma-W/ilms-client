import type { ClassGradeMatrixRow } from '@/types/grade';

export type GradeSortField =
  | 'index'
  | 'code'
  | 'studentCode'
  | 'name'
  | 'studentName'
  | 'finalScore'
  | string;
export type GradeSortOrder = 'asc' | 'desc';

// Extracts Vietnamese sort key (First name first, then middle and family names)
function getVietnameseSortKey(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  const firstName = parts[parts.length - 1];
  const rest = parts.slice(0, parts.length - 1).join(' ');
  return `${firstName} ${rest}`;
}

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

    if (sortField === 'code' || sortField === 'studentCode') {
      comparison = a.studentCode.localeCompare(b.studentCode);
    } else if (sortField === 'name' || sortField === 'studentName') {
      comparison = getVietnameseSortKey(a.studentName).localeCompare(
        getVietnameseSortKey(b.studentName),
        'vi',
      );
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

    if (comparison === 0 && sortField !== 'code' && sortField !== 'studentCode') {
      comparison = a.studentCode.localeCompare(b.studentCode);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}
