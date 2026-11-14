'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizStudioHeader } from '@/features/quizzes/components/studio/quiz-studio-header';
import { QuizStudioSidebar } from '@/features/quizzes/components/studio/quiz-studio-sidebar';
import { QuizQuestionEditor } from '@/features/quizzes/components/studio/quiz-question-editor';
import { WordImportModal } from '@/features/quizzes/components/studio/word-import-modal';
import { DistributePointsModal } from '@/features/quizzes/components/studio/distribute-points-modal';
import { quizzesService } from '@/features/quizzes/services/quizzes.service';
import { questionsService } from '@/features/quizzes/services/questions.service';
import { getQuizQuestionValidationError } from '@/features/quizzes/utils/quiz.utils';
import type { ParsedQuestion, ParsedQuizDocx, Quiz } from '@/types/quiz';
import { QuestionType, Visibility, QuizStatus } from '@/types/enum';
import { toast } from 'sonner';

interface EditQuizClientProps {
  initialQuiz: Quiz;
}

export function EditQuizClient({ initialQuiz }: EditQuizClientProps) {
  const router = useRouter();

  // Quiz Metadata State
  const [title, setTitle] = useState(initialQuiz.title);
  const [description, setDescription] = useState(initialQuiz.description ?? '');
  const [timeLimit, setTimeLimit] = useState(initialQuiz.timeLimit || 15);
  const [visibility, setVisibility] = useState<Visibility>(initialQuiz.visibility);
  const [isSaving, setIsSaving] = useState(false);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [isDistributeModalOpen, setIsDistributeModalOpen] = useState(false);

  // Map existing questions to editor format
  const [questions, setQuestions] = useState<ParsedQuestion[]>(() => {
    if (!initialQuiz.questions || initialQuiz.questions.length === 0) {
      return [];
    }
    return initialQuiz.questions.map((q, idx) => ({
      id: q.id,
      content: q.content,
      questionType: q.questionType,
      points: q.points || 1.0,
      orderIndex: idx + 1,
      explanation: q.explanation || undefined,
      options:
        q.options?.map((opt) => ({
          content: opt.content,
          isCorrect: opt.isCorrect,
        })) || [],
    }));
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Adds a new empty question
  const handleAddQuestion = () => {
    const newQ: ParsedQuestion = {
      content: '',
      questionType: QuestionType.multiple_choice,
      points: 1.0,
      orderIndex: questions.length + 1,
      options: [
        { content: '', isCorrect: true },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
      ],
    };
    setQuestions((prev) => [...prev, newQ]);
    setSelectedIndex(questions.length);
  };

  // Deletes a question by index
  const handleDeleteQuestion = (idx: number) => {
    setQuestions((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      return next.map((q, i) => ({ ...q, orderIndex: i + 1 }));
    });
    if (selectedIndex >= idx && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  // Moves question position (Drag-and-Drop or arrow buttons)
  const handleMoveQuestion = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= questions.length) return;
    setQuestions((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next.map((q, i) => ({ ...q, orderIndex: i + 1 }));
    });
    setSelectedIndex(toIdx);
  };

  // Resets all questions to start over
  const handleResetAllQuestions = () => {
    setQuestions([]);
    setSelectedIndex(0);
    toast.info('Đã xóa toàn bộ câu hỏi trong danh sách');
  };

  // Receives parsed questions from Word modal and appends/replaces in Studio
  const handleImportWord = (parsedData: ParsedQuizDocx) => {
    if (parsedData.description && !description) setDescription(parsedData.description);
    if (parsedData.questions && parsedData.questions.length > 0) {
      setSelectedIndex(questions.length);
      setQuestions((prev) => [...prev, ...parsedData.questions]);
      toast.success(`Đã thêm ${parsedData.questions.length} câu hỏi từ file Word vào đề!`);
    }
  };

  // Updates current active question
  const handleUpdateCurrentQuestion = (updated: ParsedQuestion) => {
    setQuestions((prev) => prev.map((q, i) => (i === selectedIndex ? updated : q)));
  };

  // Applies distributed points to all questions
  const handleApplyDistributedPoints = (updatedPoints: number[]) => {
    setQuestions((prev) =>
      prev.map((q, idx) => ({
        ...q,
        points: updatedPoints[idx] ?? q.points,
      })),
    );
    toast.success('Đã cập nhật thang điểm cho toàn bộ câu hỏi!');
  };

  // Saves changes to quiz metadata and questions
  const handleSaveQuiz = async () => {
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề cho đề thi');
      return;
    }

    if (questions.length === 0) {
      toast.error('Đề thi phải có ít nhất 1 câu hỏi');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const validationError = getQuizQuestionValidationError(questions[i]);
      if (validationError) {
        toast.error(`Câu hỏi ${i + 1}: ${validationError}`);
        setSelectedIndex(i);
        return;
      }
    }

    try {
      setIsSaving(true);
      // Step 1: Update Quiz metadata
      const targetStatus =
        visibility === Visibility.public
          ? QuizStatus.published
          : initialQuiz.status === QuizStatus.published
            ? QuizStatus.published
            : QuizStatus.draft;

      await quizzesService.updateQuiz(initialQuiz.id, {
        title: title.trim(),
        description: description.trim(),
        timeLimit,
        visibility,
        status: targetStatus,
      });

      await questionsService.syncQuizQuestions(
        initialQuiz.id,
        questions,
        (initialQuiz.questions ?? []).map((question) => question.id),
      );

      toast.success('Cập nhật đề thi thành công!');
      router.push(`/quizzes/${initialQuiz.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi lưu đề thi';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100/60 dark:bg-slate-950">
      {/* Sticky Header */}
      <QuizStudioHeader
        title={title}
        onTitleChange={setTitle}
        description={description}
        onDescriptionChange={setDescription}
        timeLimit={timeLimit}
        onTimeLimitChange={setTimeLimit}
        visibility={visibility}
        onVisibilityChange={setVisibility}
        onSave={handleSaveQuiz}
        isSaving={isSaving}
        onOpenWordModal={() => setIsWordModalOpen(true)}
        onOpenDistributeModal={() => setIsDistributeModalOpen(true)}
        totalQuestions={questions.length}
        totalPoints={questions.reduce((sum, q) => sum + (q.points || 0), 0)}
      />

      {/* Main Studio Two-Column Workspace */}
      <div className="flex flex-1 h-[calc(100vh-172px)] overflow-hidden">
        {/* Left: Studio Question Navigator Sidebar */}
        <QuizStudioSidebar
          questions={questions}
          selectedIndex={selectedIndex}
          onSelectIndex={setSelectedIndex}
          onAddQuestion={handleAddQuestion}
          onDeleteQuestion={handleDeleteQuestion}
          onMoveQuestion={handleMoveQuestion}
          onResetAllQuestions={handleResetAllQuestions}
          onOpenDistributeModal={() => setIsDistributeModalOpen(true)}
        />

        {/* Right: Main Editor Canvas */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {questions.length > 0 && questions[selectedIndex] ? (
              <QuizQuestionEditor
                question={questions[selectedIndex]}
                questionNumber={selectedIndex + 1}
                onChange={handleUpdateCurrentQuestion}
              />
            ) : (
              <div className="py-24 text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-md p-8 bg-white dark:bg-slate-900">
                <p className="text-sm text-slate-500 mb-3">Đề thi hiện chưa có câu hỏi nào.</p>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="text-sm font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  + Bấm vào đây để thêm câu hỏi
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Word Import Modal */}
      <WordImportModal
        open={isWordModalOpen}
        onOpenChange={setIsWordModalOpen}
        onImport={handleImportWord}
      />

      {/* Distribute Points Modal */}
      <DistributePointsModal
        isOpen={isDistributeModalOpen}
        onOpenChange={setIsDistributeModalOpen}
        questions={questions}
        onApplyPoints={handleApplyDistributedPoints}
      />
    </div>
  );
}
