'use client';

import * as React from 'react';
import { Download, FileSpreadsheet, Upload, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface ImportColumnDefinition {
  key: string;
  label: string;
  sample: string;
  required?: boolean;
}

export interface AdminImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (rows: Record<string, string>[]) => Promise<void> | void;
  title: string;
  description?: string;
  columns: ImportColumnDefinition[];
  sampleFileName: string;
  isSubmitting?: boolean;
}

export function AdminImportModal({
  isOpen,
  onClose,
  onImport,
  title,
  description = 'Nhập dữ liệu hàng loạt từ file CSV hoặc văn bản phân tách bằng dấu phẩy.',
  columns,
  sampleFileName,
  isSubmitting = false,
}: AdminImportModalProps) {
  const [parsedRows, setParsedRows] = React.useState<Record<string, string>[]>([]);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setParsedRows([]);
      setFileName(null);
      setError(null);
    }
  }, [isOpen]);

  // Downloads sample CSV template with UTF-8 BOM for perfect Excel compatibility
  const handleDownloadTemplate = () => {
    const headers = columns.map((c) => c.key).join(',');
    const sampleRow = columns.map((c) => `"${c.sample.replace(/"/g, '""')}"`).join(',');
    const csvContent = `\uFEFF${headers}\n${sampleRow}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${sampleFileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Parses RFC-compliant CSV text line by line
  const parseCSV = (text: string) => {
    const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      throw new Error('File rỗng hoặc không có dòng dữ liệu hợp lệ');
    }

    const headerLine = lines[0];
    const headerCols = headerLine.split(',').map((h) => h.trim().replace(/^"|"$/g, ''));

    // Check required columns
    const missingCols = columns
      .filter((c) => c.required)
      .filter((c) => !headerCols.includes(c.key));

    if (missingCols.length > 0) {
      throw new Error(`File thiếu các cột bắt buộc: ${missingCols.map((c) => c.label).join(', ')}`);
    }

    const rows: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle simple CSV splitting with quote awareness
      const values: string[] = [];
      let inQuote = false;
      let curVal = '';
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          values.push(curVal.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
          curVal = '';
        } else {
          curVal += char;
        }
      }
      values.push(curVal.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

      const rowObj: Record<string, string> = {};
      headerCols.forEach((col, idx) => {
        rowObj[col] = values[idx] ?? '';
      });
      rows.push(rowObj);
    }

    return rows;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const rows = parseCSV(content);
        setParsedRows(rows);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Lỗi đọc file CSV';
        setError(msg);
        setParsedRows([]);
      }
    };
    reader.onerror = () => {
      setError('Không thể đọc file từ thiết bị');
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleSubmit = async () => {
    if (parsedRows.length === 0) {
      setError('Vui lòng chọn file chứa dữ liệu hợp lệ');
      return;
    }
    await onImport(parsedRows);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
              <DialogDescription className="text-xs">{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template banner */}
          <div className="flex items-center justify-between rounded-lg border border-dashed p-3 text-xs">
            <span className="text-muted-foreground">Tải file mẫu để điền đúng định dạng cột:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="h-8 gap-1.5 text-xs"
            >
              <Download className="size-3.5" />
              Tải mẫu CSV
            </Button>
          </div>

          {/* Upload drop area */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center transition-colors hover:bg-muted/40"
            role="button"
            tabIndex={0}
          >
            <Upload className="mb-2 size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              {fileName ? fileName : 'Bấm vào đây để chọn file CSV'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Hỗ trợ định dạng .csv hoặc file text phân tách bằng dấu phẩy
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preview rows */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">
                  Xem trước dữ liệu ({parsedRows.length} dòng):
                </span>
                <span className="text-muted-foreground">Hiển thị tối đa 5 dòng đầu</span>
              </div>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="p-2">#</th>
                      {columns.map((c) => (
                        <th key={c.key} className="p-2 font-medium">
                          {c.label} {c.required && <span className="text-destructive">*</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {parsedRows.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/30">
                        <td className="p-2 text-muted-foreground">{idx + 1}</td>
                        {columns.map((c) => (
                          <td key={c.key} className="p-2">
                            {row[c.key] || <span className="text-muted-foreground italic">-</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={parsedRows.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Đang nhập...' : `Nhập ${parsedRows.length} mục`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
