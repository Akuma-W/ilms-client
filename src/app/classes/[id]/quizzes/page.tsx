import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bài trắc nghiệm lớp học',
};

export default function ClassQuizzes() {
  return (
    <div className="p-6 text-center text-sm text-muted-foreground">
      Chưa có bài trắc nghiệm nào trong lớp học này.
    </div>
  );
}
