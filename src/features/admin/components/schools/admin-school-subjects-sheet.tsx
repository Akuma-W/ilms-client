'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  BookOpen,
  ExternalLink,
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  FileSpreadsheet,
  X,
  Check,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminSchool, AdminSubject } from '@/types/admin';
import { adminSchoolService } from '../../services/admin-schools.service';
import { AdminImportModal } from '../shared/admin-import-modal';

interface AdminSchoolSubjectsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school: AdminSchool | null;
  onSchoolsChanged?: () => void;
}

const SUBJECT_IMPORT_COLUMNS = [
  { key: 'name', label: 'Tên môn học', sample: 'Cấu trúc dữ liệu và giải thuật', required: true },
  { key: 'code', label: 'Mã môn', sample: 'DSA01', required: true },
  { key: 'credits', label: 'Số tín chỉ', sample: '3' },
];

export function AdminSchoolSubjectsSheet({
  open,
  onOpenChange,
  school,
  onSchoolsChanged,
}: AdminSchoolSubjectsSheetProps) {
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [loading, setLoading] = useState(false);

  // Inline create/edit form states
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
  const [editingSubject, setEditingSubject] = useState<AdminSubject | null>(null);
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCredits, setFormCredits] = useState(3);
  const [submitting, setSubmitting] = useState(false);

  // Import CSV modal state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const fetchSubjects = useCallback(async () => {
    if (!school) return;
    setLoading(true);
    try {
      const data = await adminSchoolService.getSchoolSubjects(school.id);
      setSubjects(data);
    } finally {
      setLoading(false);
    }
  }, [school]);

  useEffect(() => {
    if (open && school) {
      fetchSubjects();
      setFormMode(null);
    }
  }, [open, school, fetchSubjects]);

  const handleStartCreate = () => {
    setEditingSubject(null);
    setFormName('');
    setFormCode('');
    setFormCredits(3);
    setFormMode('create');
  };

  const handleStartEdit = (sub: AdminSubject) => {
    setEditingSubject(sub);
    setFormName(sub.name);
    setFormCode(sub.code);
    setFormCredits(sub.credits ?? 3);
    setFormMode('edit');
  };

  const handleCancelForm = () => {
    setFormMode(null);
    setEditingSubject(null);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;
    if (!formName.trim() || !formCode.trim()) {
      toast.error('Vui lòng nhập đầy đủ tên và mã môn');
      return;
    }

    setSubmitting(true);
    try {
      if (formMode === 'create') {
        await adminSchoolService.createSubject({
          name: formName.trim(),
          code: formCode.trim().toUpperCase(),
          credits: Number(formCredits) || 3,
          schoolId: school.id,
        });
        toast.success('Đã thêm môn học mới');
      } else if (formMode === 'edit' && editingSubject) {
        await adminSchoolService.updateSubject(editingSubject.id, {
          name: formName.trim(),
          code: formCode.trim().toUpperCase(),
          credits: Number(formCredits) || 3,
        });
        toast.success('Đã cập nhật thông tin môn học');
      }
      handleCancelForm();
      await fetchSubjects();
      onSchoolsChanged?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Thao tác môn học thất bại';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubject = async (sub: AdminSubject) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa môn học "${sub.name}"?`)) return;

    try {
      const res = await adminSchoolService.deleteSubject(sub.id);
      if (res.success) {
        toast.success(res.message);
        await fetchSubjects();
        onSchoolsChanged?.();
      } else {
        toast.error(res.message);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể xóa môn học';
      toast.error(msg);
    }
  };

  const handleImportSubjects = async (rows: Record<string, string>[]) => {
    if (!school) return;
    setIsImporting(true);
    let successCount = 0;
    const errors: string[] = [];

    for (const row of rows) {
      try {
        await adminSchoolService.createSubject({
          name: row.name.trim(),
          code: row.code.trim().toUpperCase(),
          credits: Number(row.credits) || 3,
          schoolId: school.id,
        });
        successCount++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
        errors.push(`${row.code}: ${msg}`);
      }
    }

    setIsImporting(false);
    setImportModalOpen(false);
    await fetchSubjects();
    onSchoolsChanged?.();

    if (successCount > 0) {
      toast.success(`Đã thêm thành công ${successCount} môn học vào trường`);
    }
    if (errors.length > 0) {
      toast.error(`Có ${errors.length} mục thất bại: ${errors.slice(0, 3).join('; ')}`);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg p-6 flex flex-col">
          <SheetHeader className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
              <GraduationCap className="size-4" />
              <span>{school?.shortname}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-lg font-bold text-slate-900 dark:text-white">
                  Danh mục Môn học ({subjects.length})
                </SheetTitle>
                <SheetDescription className="text-xs text-slate-500">
                  Các môn học được đào tạo tại trường {school?.name}
                </SheetDescription>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                size="sm"
                onClick={handleStartCreate}
                className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1"
              >
                <Plus className="size-3.5" />
                Thêm môn
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setImportModalOpen(true)}
                className="h-8 rounded-lg text-xs gap-1"
              >
                <FileSpreadsheet className="size-3.5 text-emerald-600" />
                Nhập CSV
              </Button>
            </div>
          </SheetHeader>

          {/* Inline Form Create/Edit */}
          {formMode && (
            <form
              onSubmit={handleSubmitForm}
              className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2.5 mt-3"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                <span>{formMode === 'create' ? 'Thêm môn học mới' : 'Chỉnh sửa môn học'}</span>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  placeholder="Mã môn (VD: IT001)"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  className="h-8 text-xs rounded-lg uppercase font-mono"
                  disabled={submitting}
                />
                <Input
                  type="number"
                  min={1}
                  max={20}
                  placeholder="Số tín chỉ"
                  value={formCredits}
                  onChange={(e) => setFormCredits(Number(e.target.value) || 1)}
                  className="h-8 text-xs rounded-lg"
                  disabled={submitting}
                />
              </div>

              <Input
                type="text"
                placeholder="Tên môn học (VD: Lập trình Cơ bản)"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="h-8 text-xs rounded-lg"
                disabled={submitting}
              />

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelForm}
                  className="h-7 text-xs"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={submitting}
                  className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                >
                  <Check className="size-3" />
                  {submitting ? 'Đang lưu...' : 'Lưu môn học'}
                </Button>
              </div>
            </form>
          )}

          {/* Subjects List Body */}
          <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ) : subjects.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                Chưa có môn học nào được đăng ký cho trường này
              </div>
            ) : (
              subjects.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:border-emerald-500/40 transition-colors flex items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] py-0 px-1.5 font-mono font-semibold border-emerald-200 text-emerald-800 dark:border-emerald-800 dark:text-emerald-300"
                      >
                        {sub.code}
                      </Badge>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {sub.name}
                      </span>
                    </div>
                    {sub.credits !== undefined && (
                      <span className="text-[10px] text-slate-400 mt-0.5 inline-block">
                        {sub.credits} tín chỉ
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/admin/classes?schoolId=${school?.id}&subjectId=${sub.id}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 transition-colors"
                      title="Xem các lớp học mở môn này"
                    >
                      <BookOpen className="size-3" />
                      <span>Xem lớp</span>
                      <ExternalLink className="size-2.5" />
                    </Link>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartEdit(sub)}
                      className="size-7 rounded-md text-slate-500 hover:text-amber-600"
                      title="Chỉnh sửa môn học"
                    >
                      <Edit2 className="size-3" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSubject(sub)}
                      className="size-7 rounded-md text-slate-500 hover:text-rose-600"
                      title="Xóa môn học"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* CSV Import Modal for Subjects */}
      <AdminImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportSubjects}
        title={`Nhập danh sách môn học cho ${school?.shortname || 'trường'}`}
        columns={SUBJECT_IMPORT_COLUMNS}
        sampleFileName={`mau_mon_hoc_${school?.shortname?.toLowerCase() || 'truong'}`}
        isSubmitting={isImporting}
      />
    </>
  );
}
