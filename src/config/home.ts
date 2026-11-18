import {
  BookOpen,
  ClipboardCheck,
  DoorOpen,
  GraduationCap,
  MessageSquare,
  PenLine,
  Sparkles,
  Trophy,
  UserPlus,
  Users,
} from 'lucide-react';
import type { HomeAbout, HomeBanner, HomeFeature, HomeStep } from '@/types/home';

// Banner carousel slides for the home page hero section
export const HOME_BANNERS: HomeBanner[] = [
  {
    id: '1',
    title: 'Lớp Học Tương Tác Không Giới Hạn',
    subtitle:
      'Tạo lớp học, xem bài giảng, giao bài tập, chấm điểm và họp trực tuyến — tất cả trên một nền tảng duy nhất.',
    image: '/images/banner-class.png',
    cta: 'Khám phá lớp học',
    href: '/classes',
  },
  {
    id: '2',
    title: 'Đấu Trường Quiz — Học Mà Chơi, Chơi Mà Học',
    subtitle:
      'Tham gia bài trắc nghiệm tương tác trực tuyến, bảng xếp hạng thời gian thực và phân tích kết quả chi tiết.',
    image: '/images/banner-quiz.png',
    cta: 'Làm Quiz ngay',
    href: '/quizzes',
  },
  {
    id: '3',
    title: 'Trợ Lý AI — Gia Sư Thông Minh Luôn Bên Bạn',
    subtitle:
      'Hỏi đáp bài học tức thì, tự động sinh đề ôn tập cá nhân và nhận lộ trình học tập được AI cá nhân hóa.',
    image: '/images/banner-ai.png',
    cta: 'Trải nghiệm AI',
    href: '/tools/ai',
  },
];

// Core platform features displayed on the home page
export const HOME_FEATURES: HomeFeature[] = [
  {
    title: 'Không gian lớp học số',
    description:
      'Tạo lớp học trực tuyến, tổ chức bài giảng theo chủ đề, quản lý thành viên và sinh mã lớp để học sinh tham gia chỉ với một lần nhập mã hoặc quét QR.',
    icon: GraduationCap,
    color: 'bg-blue-500',
  },
  {
    title: 'Học liệu đa phương tiện',
    description:
      'Hỗ trợ bài giảng dạng video nhúng trực tiếp, tài liệu PDF, slide trình chiếu và liên kết tham khảo — tất cả được tổ chức gọn gàng theo từng chủ đề bài học.',
    icon: BookOpen,
    color: 'bg-emerald-500',
  },
  {
    title: 'Bài tập & chấm điểm',
    description:
      'Giảng viên giao bài tập có hạn nộp, sinh viên nộp bài trực tuyến, nhận phản hồi chi tiết và theo dõi điểm số trên sổ điểm điện tử minh bạch.',
    icon: ClipboardCheck,
    color: 'bg-amber-500',
  },
  {
    title: 'Đấu trường Quiz tương tác',
    description:
      'Kiểm tra trắc nghiệm hỗ trợ 2 chế độ: tự luyện Online và thi trực tiếp Live với mã PIN, bảng xếp hạng realtime và thống kê phổ điểm chi tiết.',
    icon: Trophy,
    color: 'bg-rose-500',
  },
  {
    title: 'Diễn đàn & chat thời gian thực',
    description:
      'Thảo luận môn học trên diễn đàn hỗ trợ bình luận ẩn danh, trò chuyện nhóm lớp học và nhắn tin 1-1 với biểu tượng cảm xúc — tất cả đồng bộ tức thì.',
    icon: MessageSquare,
    color: 'bg-violet-500',
  },
  {
    title: 'Trợ lý AI thông minh',
    description:
      'AI giải đáp thắc mắc bài học tức thì dựa trên tài liệu lớp (RAG), tự động sinh đề trắc nghiệm ôn tập, soạn slide bài giảng và xây dựng lộ trình học tập cá nhân hóa.',
    icon: Sparkles,
    color: 'bg-indigo-500',
  },
];

// About section configuration on the home page
export const HOME_ABOUT: HomeAbout = {
  badge: 'Về chúng tôi',
  title: 'Kiến tạo tương lai',
  highlightTitle: 'Học tập tương tác không giới hạn',
  description:
    'KEIVerse ra đời với sứ mệnh xây dựng một hệ sinh thái giáo dục số toàn diện, nơi giảng viên có thể tổ chức lớp học, giao bài tập, soạn đề thi và chấm điểm trên cùng một nền tảng — đồng thời sinh viên được tiếp cận bài giảng đa phương tiện, kiểm tra trắc nghiệm tương tác và nhận hỗ trợ từ Trợ lý AI thông minh 24/7. Chúng tôi tin rằng mỗi người học đều sở hữu tiềm năng riêng, và KEIVerse là công cụ giúp bạn khai phá tiềm năng đó.',
  image: '/images/about.png',
  stats: [
    {
      value: '10k+',
      label: 'Học sinh & Giảng viên tin dùng',
      icon: Users,
      color: 'text-indigo-600',
    },
    {
      value: '500+',
      label: 'Lớp học & Khóa học đa dạng',
      icon: BookOpen,
      color: 'text-purple-600',
    },
  ],
  primaryCta: {
    label: 'Khám phá lớp học',
    href: '/classes',
  },
  secondaryCta: {
    label: 'Liên hệ hỗ trợ',
    href: '/contact',
  },
};

// Step-by-step guide for new users
export const HOME_STEPS: HomeStep[] = [
  {
    title: 'Đăng ký tài khoản',
    description:
      'Tạo tài khoản bằng email hoặc đăng nhập nhanh với Google. Chọn trường học và hoàn thiện hồ sơ cá nhân để bắt đầu.',
    icon: UserPlus,
  },
  {
    title: 'Tham gia lớp học',
    description:
      'Nhập mã lớp hoặc quét mã QR để tham gia lớp học do giảng viên tạo. Giảng viên có thể tự khởi tạo lớp mới chỉ trong vài giây.',
    icon: DoorOpen,
  },
  {
    title: 'Khám phá học liệu',
    description:
      'Truy cập bài giảng video, tài liệu PDF, slide trình chiếu được giảng viên tổ chức theo từng chủ đề bài học rõ ràng.',
    icon: BookOpen,
  },
  {
    title: 'Làm bài & kiểm tra',
    description:
      'Nộp bài tập trực tuyến, tham gia kiểm tra trắc nghiệm tương tác và theo dõi kết quả điểm số ngay tức thì trên bảng điểm điện tử.',
    icon: PenLine,
  },
  {
    title: 'Tương tác & nhận hỗ trợ AI',
    description:
      'Trao đổi trên diễn đàn, chat nhóm lớp học và hỏi đáp AI thông minh bất cứ lúc nào — trợ lý học tập 24/7 luôn sẵn sàng đồng hành.',
    icon: Sparkles,
  },
];
