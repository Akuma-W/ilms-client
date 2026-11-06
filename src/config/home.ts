import {
  BarChart3,
  BookOpen,
  Cpu,
  FileText,
  GraduationCap,
  MessageSquare,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import type { HomeBanner, HomeFeature, HomeStep } from '@/types/home';

export const HOME_BANNERS: HomeBanner[] = [
  {
    id: '1',
    title: 'Chào mừng đến với KEIVerse',
    subtitle: 'Nền tảng học tập thế hệ mới dành cho sinh viên.',
    image: 'https://picsum.photos/seed/banner1/1920/600',
    cta: 'Khám phá ngay',
    href: '/login',
  },
  {
    id: '2',
    title: 'Học tập tương tác',
    subtitle: 'Tham gia các lớp học trực tuyến và thảo luận sôi nổi.',
    image: 'https://picsum.photos/seed/banner2/1920/600',
    cta: 'Xem lớp học',
    href: '/classes',
  },
  {
    id: '3',
    title: 'Bài trắc nghiệm ôn tập',
    subtitle: 'Ôn tập kiến thức với hàng ngàn câu hỏi trắc nghiệm.',
    image: 'https://picsum.photos/seed/banner3/1920/600',
    cta: 'Làm bài ngay',
    href: '/quizzes',
  },
];

export const HOME_FEATURES: HomeFeature[] = [
  {
    title: 'Tương tác lớp học',
    description:
      'Môi trường học tập trực tuyến sôi nổi, kết nối giảng viên và sinh viên thời gian thực.',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    title: 'Bài trắc nghiệm ôn tập',
    description: 'Hệ thống bài tập trắc nghiệm đa dạng, giúp củng cố kiến thức sau mỗi bài học.',
    icon: BookOpen,
    color: 'bg-purple-500',
  },
  {
    title: 'Cập nhật điểm số',
    description: 'Theo dõi tiến độ học tập và kết quả thi cử một cách minh bạch và nhanh chóng.',
    icon: BarChart3,
    color: 'bg-indigo-500',
  },
  {
    title: 'Thảo luận lớp',
    description: 'Diễn đàn trao đổi kiến thức, giải đáp thắc mắc cùng bạn bè và thầy cô.',
    icon: MessageSquare,
    color: 'bg-cyan-500',
  },
  {
    title: 'Trợ lý AI',
    description: 'Hỗ trợ giải đáp thắc mắc 24/7 với công nghệ trí tuệ nhân tạo tiên tiến.',
    icon: Cpu,
    color: 'bg-violet-500',
  },
];

export const HOME_STEPS: HomeStep[] = [
  {
    title: 'Đăng ký / Đăng nhập',
    description: 'Tạo tài khoản cá nhân để bắt đầu hành trình học tập của bạn.',
    icon: UserPlus,
  },
  {
    title: 'Tham gia / Tạo lớp',
    description: 'Kết nối với các lớp học hiện có hoặc tự tạo không gian học tập riêng.',
    icon: UserCheck,
  },
  {
    title: 'Đọc / Tạo tài liệu',
    description: 'Tiếp cận nguồn tài liệu phong phú hoặc chia sẻ kiến thức của bạn.',
    icon: FileText,
  },
  {
    title: 'Tham gia bài tập / Trắc nghiệm',
    description: 'Kiểm tra kiến thức định kỳ qua các bài tập và bài trắc nghiệm tương tác.',
    icon: GraduationCap,
  },
  {
    title: 'Tương tác & Phản hồi',
    description: 'Trao đổi trực tiếp và nhận phản hồi từ giảng viên và bạn học.',
    icon: MessageSquare,
  },
];
