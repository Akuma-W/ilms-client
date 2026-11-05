import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bài trắc nghiệm',
};

export default function QuizzesPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
      Danh sách bài trắc nghiệm đang được cập nhật.
    </div>
  );
}
