import { Metadata } from 'next';
import { CreateQuizClient } from './create-quiz-client';

export const metadata: Metadata = {
  title: 'Biên soạn đề thi mới | Interactive LMS',
  description: 'Không gian sáng tạo và biên soạn đề thi trắc nghiệm trực quan',
};

export default function CreateQuizPage() {
  return <CreateQuizClient />;
}
