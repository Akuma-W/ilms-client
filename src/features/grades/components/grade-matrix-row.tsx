import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { formatScore, getLetterGradeStyle } from '../utils/grade.utils';
import type { ClassGradeMatrixRow, GradeCategory } from '@/types/grade';

interface GradeMatrixRowProps {
  row: ClassGradeMatrixRow;
  categories: GradeCategory[];
  index: number;
  isEditing: boolean;
  draftScores?: Record<string, number | null>;
  onScoreChange?: (studentId: string, categoryId: string, val: number | null) => void;
  computedFinalScore?: number | null;
}

/**
 * Single table row rendering in the teacher grade matrix using shadcn TableCell.
 * Supports read-only presentation, visual validation on bounds [0, 10], and real-time recalculation.
 */
export function GradeMatrixRow({
  row,
  categories,
  index,
  isEditing,
  draftScores,
  onScoreChange,
  computedFinalScore,
}: GradeMatrixRowProps) {
  const finalScore =
    isEditing && computedFinalScore !== undefined ? computedFinalScore : row.finalScore;
  const rankStyle = getLetterGradeStyle(finalScore);

  return (
    <TableRow className="border-b border-border/60 hover:bg-muted/40 transition-colors">
      {/* Index */}
      <TableCell className="py-3 px-3 text-center text-xs sm:text-sm text-muted-foreground font-mono">
        {index + 1}
      </TableCell>

      {/* Student Code */}
      <TableCell className="py-3 px-4 font-mono text-xs sm:text-sm text-muted-foreground">
        {row.studentCode}
      </TableCell>

      {/* Student Info */}
      <TableCell className="py-3 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 border border-border/80 shrink-0">
            <AvatarImage src={row.avatarUrl || undefined} alt={row.studentName} />
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              {row.studentName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-medium text-foreground truncate">
              {row.studentName}
            </span>
            <span className="text-xs text-muted-foreground truncate">{row.studentEmail}</span>
          </div>
        </div>
      </TableCell>

      {/* Category Scores */}
      {categories.map((cat) => {
        const currentScore = draftScores ? draftScores[cat.id] : row.scores[cat.id];
        const isInvalid =
          currentScore !== null &&
          currentScore !== undefined &&
          (currentScore < 0 || currentScore > 10);

        if (isEditing) {
          return (
            <TableCell key={cat.id} className="py-2 px-2 text-center w-28">
              <Input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={currentScore ?? ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? null : parseFloat(e.target.value);
                  onScoreChange?.(row.studentId, cat.id, isNaN(val as number) ? null : val);
                }}
                className={cn(
                  'w-20 mx-auto text-center h-8.5 text-sm font-medium rounded-lg transition-colors',
                  isInvalid
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 focus-visible:ring-rose-500 font-bold dark:border-rose-500 dark:bg-rose-950/30 dark:text-rose-400'
                    : 'border-primary/40 focus-visible:ring-primary',
                )}
                placeholder="—"
                title={isInvalid ? 'Điểm số phải từ 0 đến 10' : undefined}
              />
            </TableCell>
          );
        }

        return (
          <TableCell key={cat.id} className="py-3 px-4 text-center font-medium text-sm w-28">
            {formatScore(currentScore)}
          </TableCell>
        );
      })}

      {/* Computed Final Score */}
      <TableCell className="py-3 px-4 text-center w-28">
        <span
          className={cn(
            'inline-flex items-center justify-center font-medium text-sm px-2.5 py-1 rounded-md w-16 mx-auto',
            rankStyle.scoreClass,
          )}
        >
          {formatScore(finalScore)}
        </span>
      </TableCell>

      {/* Letter Grade */}
      <TableCell className="py-3 px-4 text-center w-36">
        <Badge
          variant="outline"
          className={cn(
            'w-32 justify-center font-medium text-xs py-1 whitespace-nowrap shadow-none',
            rankStyle.badgeClass,
          )}
        >
          {rankStyle.label}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
