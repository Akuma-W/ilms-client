'use client';

import { useState, useCallback, useMemo } from 'react';
import { calculateFinalScore } from '../utils/grade.utils';
import type { ClassGradeMatrixRow, GradeCategory } from '@/types/grade';

interface UseGradeMatrixProps {
  rows: ClassGradeMatrixRow[];
  categories: GradeCategory[];
}

export function useGradeMatrix({ rows, categories }: UseGradeMatrixProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [prevRows, setPrevRows] = useState(rows);

  // Initialize draft scores from rows
  const [draftScores, setDraftScores] = useState<Record<string, Record<string, number | null>>>(
    () => {
      const initial: Record<string, Record<string, number | null>> = {};
      rows.forEach((r) => {
        initial[r.studentId] = { ...r.scores };
      });
      return initial;
    },
  );

  // React-recommended pattern: Adjust state when props change during render
  if (rows !== prevRows) {
    setPrevRows(rows);
    if (!isEditing) {
      const updated: Record<string, Record<string, number | null>> = {};
      rows.forEach((r) => {
        updated[r.studentId] = { ...r.scores };
      });
      setDraftScores(updated);
    }
  }

  const handleScoreChange = useCallback(
    (studentId: string, categoryId: string, score: number | null) => {
      setDraftScores((prev) => ({
        ...prev,
        [studentId]: {
          ...(prev[studentId] || {}),
          [categoryId]: score,
        },
      }));
    },
    [],
  );

  const resetDraft = useCallback(() => {
    const fresh: Record<string, Record<string, number | null>> = {};
    rows.forEach((r) => {
      fresh[r.studentId] = { ...r.scores };
    });
    setDraftScores(fresh);
    setIsEditing(false);
  }, [rows]);

  const hasInvalidScore = useMemo(() => {
    return Object.values(draftScores).some((scoresMap) =>
      Object.values(scoresMap).some(
        (score) => score !== null && score !== undefined && (score < 0 || score > 10),
      ),
    );
  }, [draftScores]);

  const getComputedFinalScore = useCallback(
    (studentId: string) => {
      const studentDraft = draftScores[studentId];
      if (!studentDraft) return null;
      return calculateFinalScore(categories, studentDraft);
    },
    [categories, draftScores],
  );

  return {
    isEditing,
    setIsEditing,
    draftScores,
    handleScoreChange,
    resetDraft,
    hasInvalidScore,
    getComputedFinalScore,
  };
}
