'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, KeyRound, Loader2, Search, Users } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FindClassCard } from '../ui/find-class-card';
import { SubjectSelectCombobox } from '@/features/subjects/components/subject-select-combobox';
import { subjectsService } from '@/features/subjects/services/subjects.service';
import { classService } from '../../services/class.service';
import { COURSE_CODE_LENGTH } from '@/config';
import type { Class, SearchStatus } from '@/types/class';
import type { SubjectClassItem } from '@/types/subject';
import { cn } from '@/lib/utils';

interface FindClassModalProps {
  trigger?: React.ReactNode;
}

export function FindClassModal({ trigger }: FindClassModalProps) {
  const router = useRouter();
  const inputId = useId();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'subject'>('code');

  // Search by code state
  const [codeInput, setCodeInput] = useState('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [result, setResult] = useState<Class | null>(null);

  // Search by subject state
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [subjectClasses, setSubjectClasses] = useState<SubjectClassItem[]>([]);
  const [isLoadingSubjectClasses, setIsLoadingSubjectClasses] = useState(false);

  const isValidLength = codeInput.length === COURSE_CODE_LENGTH;
  const isLoading = status === 'loading';
  const canSubmit = isValidLength && !isLoading;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setCodeInput('');
      setStatus('idle');
      setResult(null);
      setSelectedSubjectId('');
      setSubjectClasses([]);
    }
  };

  const handleSearchCode = async () => {
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

  const handleSubjectChange = async (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    if (!subjectId) {
      setSubjectClasses([]);
      return;
    }

    setIsLoadingSubjectClasses(true);
    try {
      const classes = await subjectsService.getSubjectClasses(subjectId);
      setSubjectClasses(classes);
    } catch {
      setSubjectClasses([]);
    } finally {
      setIsLoadingSubjectClasses(false);
    }
  };

  const handleNavigate = (id: string) => {
    handleOpenChange(false);
    router.push(`/classes/${id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="outline"
            className="h-11 px-6 border-galaxy-blue text-galaxy-blue font-bold hover:bg-galaxy-blue/5"
          >
            <Search className="w-4 h-4 mr-1.5" />
            Tìm lớp học
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-galaxy-blue">
            Tìm kiếm & Tham gia lớp học
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Tra cứu theo mã lớp do giảng viên cấp hoặc duyệt lớp theo môn học.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as 'code' | 'subject')}
          className="pt-1"
        >
          <TabsList className="grid grid-cols-2 w-full h-10 rounded-xl bg-muted/60 p-1">
            <TabsTrigger value="code" className="rounded-lg text-xs font-semibold gap-1.5">
              <KeyRound className="size-3.5" />
              Mã lớp ({COURSE_CODE_LENGTH} ký tự)
            </TabsTrigger>
            <TabsTrigger value="subject" className="rounded-lg text-xs font-semibold gap-1.5">
              <BookOpen className="size-3.5" />
              Theo môn học
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Find by Course Code */}
          <TabsContent value="code" className="space-y-4 pt-3">
            <div className="space-y-1.5">
              <Label htmlFor={inputId} className="text-xs font-semibold text-foreground">
                Nhập mã mời lớp học
              </Label>
              <div className="flex gap-2">
                <Input
                  id={inputId}
                  placeholder="VD: IT4440"
                  value={codeInput}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchCode()}
                  onChange={(e) => {
                    setCodeInput(e.target.value.toUpperCase().slice(0, COURSE_CODE_LENGTH));
                    if (status !== 'idle') setStatus('idle');
                  }}
                  maxLength={COURSE_CODE_LENGTH}
                  className="font-mono tracking-widest uppercase h-10 rounded-xl text-sm"
                  autoFocus
                />
                <Button
                  onClick={handleSearchCode}
                  disabled={!canSubmit}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-5 rounded-xl font-semibold shrink-0"
                >
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Tìm kiếm'}
                </Button>
              </div>
            </div>

            {status === 'not_found' && (
              <div className="rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
                Không tìm thấy lớp học với mã{' '}
                <span className="font-mono font-bold text-foreground">{codeInput}</span>.
              </div>
            )}

            {status === 'found' && result && (
              <FindClassCard classItem={result} onNavigate={handleNavigate} />
            )}
          </TabsContent>

          {/* Tab 2: Find by Subject */}
          <TabsContent value="subject" className="space-y-3.5 pt-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Chọn môn học để xem các lớp đang mở
              </Label>
              <SubjectSelectCombobox
                value={selectedSubjectId}
                onValueChange={handleSubjectChange}
                placeholder="Chọn môn học (IT001, IT003, SE347...)"
              />
            </div>

            {isLoadingSubjectClasses && (
              <div className="p-6 text-center text-xs text-muted-foreground animate-pulse">
                Đang tìm danh sách lớp học thuộc môn...
              </div>
            )}

            {!isLoadingSubjectClasses && selectedSubjectId && subjectClasses.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/20 border border-border/70 rounded-xl">
                Hiện chưa có lớp học nào đang mở cho môn học này.
              </p>
            )}

            {!isLoadingSubjectClasses && subjectClasses.length > 0 && (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {subjectClasses.map((cls) => {
                  const isFull = Boolean(cls.maxStudents && cls.totalStudents >= cls.maxStudents);
                  return (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/60 hover:bg-muted/40 transition-colors"
                    >
                      <div className="min-w-0 pr-3">
                        <h5 className="font-bold text-xs text-foreground truncate">{cls.title}</h5>
                        <p className="text-[11px] text-muted-foreground truncate">
                          GV: {cls.teacher?.fullName || 'Giảng viên'}{' '}
                          {cls.semester ? `• ${cls.semester}` : ''}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold">
                          <Users className="size-3 text-muted-foreground" />
                          <span className={cn(isFull ? 'text-amber-600' : 'text-emerald-600')}>
                            {cls.totalStudents}/{cls.maxStudents ?? 60} sinh viên
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        disabled={isFull}
                        onClick={() => handleNavigate(cls.id)}
                        className="rounded-lg text-xs h-8 px-3 shrink-0"
                      >
                        {isFull ? 'Đã đủ' : 'Vào lớp'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
