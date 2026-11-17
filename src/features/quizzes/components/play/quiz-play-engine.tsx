'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { QuizPlayHeader } from './quiz-play-header';
import { QuizPlayCard } from './quiz-play-card';
import { QuizPlayOptions } from './quiz-play-options';
import { QuizPlayNavigationToolbar } from './quiz-play-navigation-toolbar';
import { QuizPlayConfirmDialog } from './quiz-play-confirm-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useQuizPlayTimer } from '../../hooks/use-quiz-play-timer';
import { quizAttemptsService } from '../../services/quiz-attempts.service';
import { clearQuizDraft, loadQuizDraft, saveQuizDraft } from '../../utils/quiz-taking.utils';
import { QuestionType, ReviewMode } from '@/types/enum';
import type {
  CheckedAnswerResult,
  QuizAttemptResult,
  QuizAttemptSession,
  SubmitQuizAnswer,
} from '@/types/quiz';

interface QuizPlayEngineProps {
  session: QuizAttemptSession;
  reviewMode?: ReviewMode;
  onExit?: () => void;
  onCompleted?: (result: QuizAttemptResult) => void;
}

export function QuizPlayEngine({
  session,
  reviewMode = ReviewMode.after_submission,
  onExit,
  onCompleted,
}: QuizPlayEngineProps) {
  const isImmediate = reviewMode === ReviewMode.immediate;
  const draftKey = `quiz_draft_${session.attemptId}`;

  // Session question and answers state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, CheckedAnswerResult>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const totalQuestions = session.questions.length;
  const currentQuestion = session.questions[currentIndex];
  const answeredCount = Object.keys(answers).filter(
    (qId) => (answers[qId] || []).length > 0,
  ).length;

  // Restore draft from local storage on mount
  useEffect(() => {
    const draft = loadQuizDraft(draftKey);
    if (draft) {
      if (draft.answers) setAnswers(draft.answers);
      if (typeof draft.currentIndex === 'number' && draft.currentIndex < totalQuestions) {
        setCurrentIndex(draft.currentIndex);
      }
    }
  }, [draftKey, totalQuestions]);

  // Submit attempt to server
  const handleFinalSubmit = useCallback(async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const submissionAnswers: SubmitQuizAnswer[] = session.questions.map((q) => ({
        questionId: q.id,
        selectedOptionIds: answers[q.id] || [],
      }));

      const result = await quizAttemptsService.submitAttempt(session.attemptId, submissionAnswers);
      clearQuizDraft(draftKey);
      toast.success('Nộp bài thi thành công!');
      onCompleted?.(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi nộp bài thi';
      toast.error(msg);
      setIsSubmitting(false);
    }
  }, [answers, draftKey, isSubmitting, onCompleted, session.attemptId, session.questions]);

  // Wall-clock countdown timer with auto-submit
  const handleTimeUp = useCallback(() => {
    toast.warning('Đã hết thời gian làm bài! Đang tự động nộp bài...');
    handleFinalSubmit();
  }, [handleFinalSubmit]);

  const { remainingSeconds } = useQuizPlayTimer({
    startedAt: session.startedAt,
    timeLimit: session.timeLimit,
    onTimeUp: handleTimeUp,
  });

  // Toggles selected option for current question
  const handleToggleOption = (optionId: string) => {
    if (!currentQuestion) return;
    if (isImmediate && checkedAnswers[currentQuestion.id]) return;

    setAnswers((prev) => {
      const currentSelected = prev[currentQuestion.id] || [];
      let nextSelected: string[];

      if (currentQuestion.questionType === QuestionType.multiple_select) {
        nextSelected = currentSelected.includes(optionId)
          ? currentSelected.filter((id) => id !== optionId)
          : [...currentSelected, optionId];
      } else {
        nextSelected = [optionId];
      }

      const nextAnswers = { ...prev, [currentQuestion.id]: nextSelected };
      saveQuizDraft(draftKey, { answers: nextAnswers, currentIndex });
      return nextAnswers;
    });
  };

  // Immediate mode: verifies answer with server
  const handleCheckCurrentAnswer = async () => {
    if (!currentQuestion || isCheckingAnswer) return;
    const selected = answers[currentQuestion.id] || [];
    if (selected.length === 0) {
      toast.info('Vui lòng chọn ít nhất 1 đáp án trước khi kiểm tra');
      return;
    }

    try {
      setIsCheckingAnswer(true);
      const result = await quizAttemptsService.checkAnswer(
        session.attemptId,
        currentQuestion.id,
        selected,
      );
      setCheckedAnswers((prev) => ({ ...prev, [currentQuestion.id]: result }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể kiểm tra đáp án';
      toast.error(msg);
    } finally {
      setIsCheckingAnswer(false);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      saveQuizDraft(draftKey, { answers, currentIndex: nextIndex });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      saveQuizDraft(draftKey, { answers, currentIndex: prevIndex });
    }
  };

  if (!currentQuestion) {
    return (
      <div className="fixed inset-0 z-60 bg-slate-950 text-white flex items-center justify-center p-8">
        <p className="text-slate-400">Không tìm thấy câu hỏi</p>
      </div>
    );
  }

  const currentSelectedOptions = answers[currentQuestion.id] || [];
  const currentCheckedResult = checkedAnswers[currentQuestion.id] || null;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const accumulatedPoints = Object.values(checkedAnswers).reduce(
    (sum, item) => sum + (item.pointsEarned || 0),
    0,
  );

  return (
    <div className="fixed inset-0 z-60 bg-slate-950 text-white flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Top Fixed Header */}
      <QuizPlayHeader
        title={session.title}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        remainingSeconds={remainingSeconds}
        timeLimit={session.timeLimit}
        answeredCount={answeredCount}
        accumulatedPoints={accumulatedPoints}
        isImmediate={isImmediate}
        onExitClick={() => setIsExitModalOpen(true)}
        onSubmitClick={() => setIsConfirmModalOpen(true)}
        isSubmitting={isSubmitting}
      />

      {/* Main Question & Options Scrollable Arena */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:py-8 max-w-4xl w-full mx-auto flex flex-col justify-start gap-6">
        <QuizPlayCard question={currentQuestion} questionNumber={currentIndex + 1} />
        <QuizPlayOptions
          options={currentQuestion.options}
          questionType={currentQuestion.questionType}
          selectedOptionIds={currentSelectedOptions}
          onToggleOption={handleToggleOption}
          disabled={isSubmitting || (isImmediate && !!currentCheckedResult)}
          checkedResult={currentCheckedResult}
        />
      </main>

      {/* Bottom Fixed Navigation Toolbar */}
      <QuizPlayNavigationToolbar
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        isImmediate={isImmediate}
        isLastQuestion={isLastQuestion}
        isSubmitting={isSubmitting}
        isCheckingAnswer={isCheckingAnswer}
        hasSelectedOptions={currentSelectedOptions.length > 0}
        currentCheckedResult={currentCheckedResult}
        accumulatedPoints={accumulatedPoints}
        onPrev={handlePrev}
        onNext={handleNext}
        onCheckAnswer={handleCheckCurrentAnswer}
        onSubmit={isImmediate ? handleFinalSubmit : () => setIsConfirmModalOpen(true)}
      />

      {/* Confirmation Dialog before submitting */}
      <QuizPlayConfirmDialog
        open={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        isSubmitting={isSubmitting}
        onConfirmSubmit={handleFinalSubmit}
      />

      {/* Confirmation Dialog before exiting early */}
      <AlertDialog open={isExitModalOpen} onOpenChange={setIsExitModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rời phòng thi?</AlertDialogTitle>
            <AlertDialogDescription>
              Tiến độ và các câu trả lời bạn đã chọn sẽ được lưu tạm thời. Bạn có thể quay lại tiếp
              tục làm bài bất cứ lúc nào trước khi thời gian kết thúc hoặc tiến hành nộp bài chính
              thức.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ở lại làm bài</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsExitModalOpen(false);
                if (onExit) {
                  onExit();
                } else {
                  window.history.back();
                }
              }}
              className="bg-rose-600 hover:bg-rose-500 text-white"
            >
              Rời phòng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
