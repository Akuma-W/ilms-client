// Score bin definition for dynamic quiz score distributions
interface ScoreBin {
  id: string;
  label: string;
  percentageLabel: string;
  minScore: number;
  maxScore: number;
  count: number;
  percentage: number;
  color: string;
}

// Calculate dynamic 5 percentage bins adapting to any total points scale
export function calcScoreBins(
  attempts: Array<{ score: number | null }>,
  totalPoints: number,
): ScoreBin[] {
  const safeTotal = totalPoints > 0 ? totalPoints : 10;
  const submitted = attempts.filter((a) => a.score !== null && a.score !== undefined);
  const totalCount = submitted.length;

  const roundPoint = (pts: number) => Math.round(pts * 10) / 10;

  const binDefs = [
    {
      id: 'ge90',
      percentageLabel: '>= 90%',
      minRatio: 0.9,
      maxRatio: 1.0,
      color: '#10b981', // Emerald
    },
    {
      id: '80to89',
      percentageLabel: '80% - 89%',
      minRatio: 0.8,
      maxRatio: 0.8999,
      color: '#3b82f6', // Blue
    },
    {
      id: '65to79',
      percentageLabel: '65% - 79%',
      minRatio: 0.65,
      maxRatio: 0.7999,
      color: '#8b5cf6', // Violet
    },
    {
      id: '50to64',
      percentageLabel: '50% - 64%',
      minRatio: 0.5,
      maxRatio: 0.6499,
      color: '#f59e0b', // Amber
    },
    {
      id: 'lt50',
      percentageLabel: '< 50%',
      minRatio: 0.0,
      maxRatio: 0.4999,
      color: '#f43f5e', // Rose
    },
  ];

  return binDefs.map((def) => {
    const minScore = roundPoint(safeTotal * def.minRatio);
    const maxScore = roundPoint(safeTotal * (def.maxRatio === 1.0 ? 1.0 : def.maxRatio));

    const count = submitted.filter((item) => {
      const score = item.score ?? 0;
      if (def.id === 'ge90') {
        return score >= safeTotal * 0.9;
      }
      if (def.id === 'lt50') {
        return score < safeTotal * 0.5;
      }
      return (
        score >= safeTotal * def.minRatio &&
        score < safeTotal * (def.minRatio + (def.id === '80to89' ? 0.1 : 0.15))
      );
    }).length;

    const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    const label = `${def.percentageLabel} (${minScore} - ${maxScore} đ)`;

    return {
      id: def.id,
      label,
      percentageLabel: def.percentageLabel,
      minScore,
      maxScore,
      count,
      percentage,
      color: def.color,
    };
  });
}

// Format score string with optional total points
export function formatScore(score: number | null | undefined, totalPoints?: number): string {
  if (score === null || score === undefined) return '--';
  const rounded = Math.round(score * 100) / 100;
  if (totalPoints !== undefined) {
    return `${rounded}/${totalPoints}`;
  }
  return `${rounded}`;
}

// Calculate percentage rounded to 1 decimal place
export function calcPercentage(score: number | null | undefined, totalPoints: number): number {
  if (score === null || score === undefined || !totalPoints || totalPoints <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((score / totalPoints) * 1000) / 10));
}
