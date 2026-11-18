import { Subject } from '@/types/subject';

export const MOCK_FALLBACK_SUBJECTS: Subject[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    code: 'IT001',
    name: 'Nhập môn lập trình',
    credits: 3,
    isActive: true,
    description: 'Học phần cơ sở ngành trang bị tư duy giải thuật và lập trình',
    schoolId: 'school-default',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    code: 'IT003',
    name: 'Cấu trúc dữ liệu và giải thuật',
    credits: 4,
    isActive: true,
    description: 'Học phần nâng cao về mảng, danh sách liên kết, cây và đồ thị',
    schoolId: 'school-default',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    code: 'SE347',
    name: 'Công nghệ Web và Ứng dụng',
    credits: 3,
    isActive: true,
    description: 'Xây dựng ứng dụng web hiện đại với React, Next.js và NestJS',
    schoolId: 'school-default',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    code: 'SS007',
    name: 'Kinh tế chính trị Mác - Lênin',
    credits: 2,
    isActive: true,
    description: 'Học phần đại cương bắt buộc',
    schoolId: 'school-default',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  },
];

export function getMockSubjects(): Subject[] {
  return MOCK_FALLBACK_SUBJECTS;
}
