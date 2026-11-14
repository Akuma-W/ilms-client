import { useEffect, useState } from 'react';
import { calcRemainingSeconds } from '../utils/quiz-taking.utils';

interface UseQuizPlayTimerOptions {
  startedAt: string;
  timeLimit: number;
  onTimeUp: () => void;
}

// Wall-clock countdown timer with automatic time-up callback
export function useQuizPlayTimer({ startedAt, timeLimit, onTimeUp }: UseQuizPlayTimerOptions) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    calcRemainingSeconds(startedAt, timeLimit)
  );

  useEffect(() => {
    if (!timeLimit || timeLimit <= 0) return;

    const interval = setInterval(() => {
      const left = calcRemainingSeconds(startedAt, timeLimit);
      setRemainingSeconds(left);

      if (left <= 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, timeLimit, onTimeUp]);

  const isTimeLimitActive = timeLimit > 0;
  const isUrgent = isTimeLimitActive && remainingSeconds <= 60 && remainingSeconds > 0;

  return {
    remainingSeconds,
    isTimeLimitActive,
    isUrgent,
  };
}
