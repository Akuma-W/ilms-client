import type { GradeCategory } from '@/types/grade';

/**
 * Calculates the weighted final score given a list of categories and scores.
 * Uses formula: sum(score_i * (weight_i / totalWeight)) normalized to scale 10.
 */
export function calculateFinalScore(
  categories: GradeCategory[],
  scores: Record<string, number | null>,
): number {
  if (!categories || categories.length === 0) return 0;

  let totalWeight = 0;
  let weightedSum = 0;

  for (const cat of categories) {
    const weight = cat.weight > 1 ? cat.weight / 100 : cat.weight;
    const score = scores[cat.id];

    if (score !== null && score !== undefined && !isNaN(score)) {
      weightedSum += score * weight;
      totalWeight += weight;
    }
  }

  if (totalWeight === 0) return 0;
  const result = weightedSum / (totalWeight > 0.99 ? 1 : totalWeight);
  return Math.round(result * 100) / 100;
}

/**
 * Converts a numerical score on scale 10 to standard letter grade label.
 */
export function getLetterGrade(score: number): string {
  if (score >= 8.5) return 'A (Giỏi)';
  if (score >= 7.0) return 'B (Khá)';
  if (score >= 5.5) return 'C (Trung bình)';
  if (score >= 4.0) return 'D (Yếu)';
  return 'F (Kém)';
}

/**
 * Returns color styles and label according to academic rank.
 */
export function getLetterGradeStyle(score: number): {
  label: string;
  badgeClass: string;
  scoreClass: string;
} {
  if (score >= 8.5) {
    return {
      label: 'A (Giỏi)',
      badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      scoreClass:
        'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
    };
  }
  if (score >= 7.0) {
    return {
      label: 'B (Khá)',
      badgeClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
      scoreClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30',
    };
  }
  if (score >= 5.5) {
    return {
      label: 'C (Trung bình)',
      badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
      scoreClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30',
    };
  }
  if (score >= 4.0) {
    return {
      label: 'D (Yếu)',
      badgeClass: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30',
      scoreClass:
        'bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30',
    };
  }
  return {
    label: 'F (Kém)',
    badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    scoreClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30',
  };
}

/**
 * Formats score with 1-2 decimal places.
 */
export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined || isNaN(score)) return '-';
  return Number.isInteger(score) ? score.toFixed(1) : score.toFixed(2);
}
