import { Phone, Mail, MapPin, Facebook, Linkedin, Github, Youtube, Clock } from 'lucide-react';

const navItems = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Lớp học', href: '/classes' },
  { label: 'Quiz', href: '/quizzes' },
  { label: 'Công cụ', href: '/tools' },
  { label: 'Liên hệ', href: '/contact' },
];

const quickLinks = [
  { label: 'Tham gia ngay', href: '/login' },
  { label: 'Lớp học', href: '/classes' },
  { label: 'Ôn tập Quiz', href: '/quizzes' },
  { label: 'Liên hệ', href: '/contact' },
];

const contacts = [
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
    items: [
      { value: 'Thứ 2 - Thứ 6: 08:00 - 18:00' },
      // { value: 'Thứ 7: 08:00 - 12:00' },
    ],
    color: 'bg-green-100 text-green-600',
  },
];

const socials = [
  { icon: Facebook, href: 'https://www.facebook.com', hover: 'hover:bg-blue-500' },
  { icon: Linkedin, href: 'https://www.linkedin.com', hover: 'hover:bg-blue-700' },
  { icon: Github, href: 'https://www.github.com', hover: 'hover:bg-gray-600' },
  { icon: Youtube, href: 'https://www.youtube.com', hover: 'hover:bg-red-600' },
];

export { navItems, quickLinks, contacts, socials };
