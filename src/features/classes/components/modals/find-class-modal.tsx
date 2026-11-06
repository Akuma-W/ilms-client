'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Search } from 'lucide-react';
import { useId, useState } from 'react';
import { FindClassCard } from '../ui/find-class-card';
import { useRouter } from 'next/navigation';
import { COURSE_CODE_LENGTH } from '@/config';
import type { Class, SearchStatus } from '@/types/class';
import { classService } from '../../services/class.service';

interface FindClassModalProps {
  trigger?: React.ReactNode;
}

export function FindClassModal({ trigger }: FindClassModalProps) {
  const router = useRouter();
  const inputId = useId();

  const [isOpen, setIsOpen] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [result, setResult] = useState<Class | null>(null);

  const isValidLength = codeInput.length === COURSE_CODE_LENGTH;
  const isLoading = status === 'loading';
  const canSubmit = isValidLength && !isLoading;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setCodeInput('');
  };

  const handleSearch = async () => {
    if (!canSubmit) return;

    setStatus('loading');
    setResult(null);

    const { data, statusCode, success } = await classService.getClassByCourseCode(codeInput);

    if (!success) {
      setStatus(statusCode === 404 ? 'not_found' : 'error');
      return;
    }

    setResult(data);
    setStatus('found');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodeInput(e.target.value.toUpperCase().slice(0, COURSE_CODE_LENGTH));

    if (status !== 'idle') {
      setStatus('idle');
      setResult(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleNavigate = (id: string) => {
    handleOpenChange(false);
    router.push(`/classes/${id}/info`);
  };

  const handleRetry = () => {
    setStatus('idle');
    document.getElementById(inputId)?.focus();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="outline"
            className="cursor-pointer h-11 px-6 border-galaxy-blue text-galaxy-blue font-bold hover:bg-galaxy-blue/5"
          >
            <Search className="w-4 h-4" />
            Nhập mã
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-galaxy-blue">
            Tìm lớp học theo mã
          </DialogTitle>
          <DialogDescription>
            Nhập mã lớp do giảng viên cung cấp để tham gia vào lớp
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          <div className="space-y-2">
            <Label htmlFor="courseCode" className="text-galaxy-blue/90 font-bold">
              Nhập mã lớp{' '}
              <span className="text-muted-foreground font-normal">
                ({COURSE_CODE_LENGTH} ký tự, ví dụ: IT4440)
              </span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="courseCode"
                placeholder="VD: IT4440"
                value={codeInput}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                maxLength={COURSE_CODE_LENGTH}
                className="font-mono tracking-widest uppercase"
                autoComplete="off"
                autoFocus
                readOnly={isLoading}
                aria-invalid={status === 'not_found' || status === 'error'}
              />
              <Button
                onClick={handleSearch}
                disabled={!canSubmit}
                className="cursor-pointer bg-galaxy text-white hover:bg-galaxy/90 hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                    Đang tìm
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Tìm kiếm
                  </>
                )}
              </Button>
            </div>
          </div>

          {codeInput.length > 0 && !isValidLength && (
            <p className="text-xs text-muted-foreground">
              Mã lớp cần có {COURSE_CODE_LENGTH} ký tự.
            </p>
          )}

          {/* Không tìm thấy */}
          {status === 'not_found' && (
            <div className="rounded-lg border border-dashed px-4 py-6 text-center space-y-1">
              <p className="text-sm font-medium">Không tìm thấy lớp học</p>
              <p className="text-xs text-muted-foreground">
                Kiểm tra lại mã <span className="font-mono font-medium">{codeInput}</span> hoặc liên
                hệ giáo viên.
              </p>
            </div>
          )}

          {/* Lỗi */}
          {status === 'error' && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-4 space-y-3">
              <p className="text-sm text-destructive">Có lỗi xảy ra, vui lòng thử lại.</p>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Thử lại
              </Button>
            </div>
          )}

          {/* Kết quả */}
          {status === 'found' && result && (
            <FindClassCard classItem={result} onNavigate={handleNavigate} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
