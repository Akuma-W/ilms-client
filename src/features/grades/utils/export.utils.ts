import { toast } from 'sonner';
import type { ClassGradeMatrixRow, GradeCategory } from '@/types/grade';

/**
 * Exports gradebook matrix rows and categories to a UTF-8 BOM CSV file for Microsoft Excel.
 */
export function exportGradesToCsv(
  categories: GradeCategory[],
  rows: ClassGradeMatrixRow[],
  className = 'lop-hoc',
) {
  try {
    const headers = ['STT', 'Mã số SV', 'Họ và tên', 'Email'];
    categories.forEach((cat) => {
      headers.push(`${cat.name} (${Math.round(cat.weight * 100)}%)`);
    });
    headers.push('Tổng kết (Hệ 10)', 'Xếp loại');

    const csvRows = [headers.join(',')];

    rows.forEach((r, idx) => {
      const scores = categories.map((cat) => r.scores[cat.id] ?? '');
      const rowData = [
        idx + 1,
        `"${r.studentCode}"`,
        `"${r.studentName}"`,
        `"${r.studentEmail}"`,
        ...scores,
        r.finalScore,
        `"${r.letterGrade}"`,
      ];
      csvRows.push(rowData.join(','));
    });

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedTitle = className.toLowerCase().replace(/[^a-z0-9]/g, '-');
    link.setAttribute(
      'download',
      `bang-diem-${sanitizedTitle}-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Đã xuất file CSV bảng điểm thành công!');
  } catch {
    toast.error('Có lỗi xảy ra khi xuất file bảng điểm!');
  }
}
