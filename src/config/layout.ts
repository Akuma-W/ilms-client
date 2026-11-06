import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Linkedin,
  Github,
  Youtube,
  Clock,
  Home,
  GraduationCap,
  BookOpen,
  Dices,
  HelpCircle,
} from 'lucide-react';

export const MAIN_NAV_ITEMS = [
  { label: 'Trang chủ', href: '/', icon: Home },
  { label: 'Lớp học', href: '/classes', icon: GraduationCap },
  { label: 'Bài trắc nghiệm', href: '/quizzes', icon: BookOpen },
  { label: 'Công cụ', href: '/tools', icon: Dices },
  { label: 'Liên hệ', href: '/contact', icon: HelpCircle },
] as const;

export const QUICK_LINKS = [
  { label: 'Tham gia ngay', href: '/login' },
  { label: 'Lớp học', href: '/classes' },
  { label: 'Trắc nghiệm ôn tập', href: '/quizzes' },
  { label: 'Liên hệ', href: '/contact' },
] as const;

export const FOOTER_CONTACTS = [
  {
    key: 'phone',
    icon: Phone,
    title: 'Điện thoại',
    items: [
      {
        label: 'Hotline',
        value: '+84 961 243 758',
        href: 'tel:+84961243758',
      },
    ],
    color: 'bg-blue-100 text-blue-600',
  },
  {
    key: 'email',
    icon: Mail,
    title: 'Email',
    items: [
      {
        label: 'Support',
        value: 'keiverse41@gmail.com',
        href: 'mailto:keiverse41@gmail.com',
      },
    ],
    color: 'bg-purple-100 text-purple-600',
  },
  {
    key: 'address',
    icon: MapPin,
    title: 'Địa chỉ',
    items: [
      {
        value: 'Thành phố Hồ Chí Minh, Việt Nam',
      },
    ],
    color: 'bg-orange-100 text-orange-600',
  },
  {
    key: 'working-time',
    icon: Clock,
    title: 'Giờ làm việc',
    items: [{ value: 'Thứ 2 - Thứ 6: 08:00 - 18:00' }],
    color: 'bg-green-100 text-green-600',
  },
] as const;

export const SOCIAL_LINKS = [
  { icon: Facebook, href: 'https://www.facebook.com', hover: 'hover:bg-blue-500' },
  { icon: Linkedin, href: 'https://www.linkedin.com', hover: 'hover:bg-blue-700' },
  { icon: Github, href: 'https://www.github.com', hover: 'hover:bg-gray-600' },
  { icon: Youtube, href: 'https://www.youtube.com', hover: 'hover:bg-red-600' },
] as const;
