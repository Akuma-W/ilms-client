'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { parseQuizDocxFile } from '@/features/quizzes/utils/quiz-docx-parser.util';
import { changeParsedQuestionType } from '@/features/quizzes/utils/quiz.utils';
import { WordImportParsedPreview } from './word-import-parsed-preview';
import type { ParsedQuizDocx } from '@/types/quiz';
import { QuestionType } from '@/types/enum';
import { FileText, Upload, Download, AlertCircle, HelpCircle, Loader2 } from 'lucide-react';

interface WordImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (parsedData: ParsedQuizDocx) => void;
}

export function WordImportModal({ open, onOpenChange, onImport }: WordImportModalProps) {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedQuizDocx | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handles reading and parsing uploaded Word document
  const handleFileProcess = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.docx')) {
      setError('Vui lòng chỉ chọn tệp định dạng Word (.docx)');
      return;
    }

    try {
      setIsParsing(true);
      setError(null);
      const data = await parseQuizDocxFile(file);

      if (!data.questions || data.questions.length === 0) {
        setError(
          'Không tìm thấy câu hỏi hợp lệ trong file. Vui lòng kiểm tra lại cấu trúc file mẫu.',
        );
        setParsedResult(null);
        return;
      }

      setParsedResult(data);
      // Select all parsed questions by default
      setSelectedIndices(new Set(data.questions.map((_, i) => i)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định khi đọc file Word';
      setError(`Không thể bóc tách file: ${msg}`);
      setParsedResult(null);
    } finally {
      setIsParsing(false);
    }
  };

  // Handles native file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  // Handles drag and drop events
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  // Toggles question inclusion
  const toggleSelectQuestion = (idx: number) => {
    const next = new Set(selectedIndices);
    if (next.has(idx)) {
      next.delete(idx);
    } else {
      next.add(idx);
    }
    setSelectedIndices(next);
  };

  const handleQuestionTypeChange = (index: number, questionType: QuestionType) => {
    setParsedResult((current) =>
      current
        ? {
            ...current,
            questions: current.questions.map((question, questionIndex) =>
              questionIndex === index ? changeParsedQuestionType(question, questionType) : question,
            ),
          }
        : current,
    );
  };

  const handleSelectAll = () => {
    setSelectedIndices(new Set(parsedResult?.questions.map((_, index) => index) ?? []));
  };

  const handleDeselectAll = () => setSelectedIndices(new Set());

  // Confirms import and passes selected questions to Studio
  const handleConfirmImport = () => {
    if (!parsedResult) return;
    const filteredQuestions = parsedResult.questions.filter((_, i) => selectedIndices.has(i));
    onImport({
      ...parsedResult,
      questions: filteredQuestions,
    });
    handleClose();
  };

  // Resets state on close
  const handleClose = () => {
    setParsedResult(null);
    setError(null);
    setSelectedIndices(new Set());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-6 rounded-md border border-slate-200 dark:border-slate-800 shadow-xs">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-rose-600" />
            Nhập câu hỏi từ file Word (.docx)
          </DialogTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hệ thống tự động bóc tách tiêu đề, số câu, đáp án đúng và lời giải thích vào Studio.
          </p>
        </DialogHeader>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Upload Zone & Instructions */}
        {!parsedResult && (
          <div className="space-y-4 my-2">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 rounded-md p-8 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center justify-center gap-3"
            >
              {isParsing ? (
                <>
                  <Loader2 className="h-10 w-10 text-rose-600 animate-spin" />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Đang bóc tách dữ liệu từ file Word...
                  </p>
                </>
              ) : (
                <>
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-full text-rose-600">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      Kéo thả file .docx vào đây hoặc bấm để chọn file
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Hỗ trợ tệp Microsoft Word (.docx)</p>
                  </div>
                </>
              )}
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-md text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Template Download Recommendation */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                  Chưa có file đề theo chuẩn?
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tải file Word mẫu có sẵn hướng dẫn và các dạng câu hỏi thực tế.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-sm h-8 rounded-md border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700"
              >
                <a href="/templates/quiz_template.docx" download="quiz_template.docx">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Tải file mẫu
                </a>
              </Button>
            </div>
          </div>
        )}

        {parsedResult && (
          <WordImportParsedPreview
            parsedResult={parsedResult}
            selectedIndices={selectedIndices}
            onToggle={toggleSelectQuestion}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onTypeChange={handleQuestionTypeChange}
          />
        )}

        <DialogFooter className="pt-2 border-t border-slate-200 dark:border-slate-800 flex sm:justify-between items-center gap-2">
          {parsedResult ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setParsedResult(null)}
                className="text-sm h-9 rounded-md text-slate-600"
              >
                Chọn file khác
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  className="text-sm h-9 rounded-md"
                >
                  Hủy
                </Button>
                <Button
                  size="sm"
                  onClick={handleConfirmImport}
                  disabled={selectedIndices.size === 0}
                  className="text-sm h-9 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-xs"
                >
                  Đưa {selectedIndices.size} câu vào Studio
                </Button>
              </div>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="text-sm h-9 rounded-md ml-auto"
            >
              Đóng
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
