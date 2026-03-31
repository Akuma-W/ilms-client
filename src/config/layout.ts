import { Phone, Mail, MapPin, Facebook, Linkedin, Github, Youtube } from 'lucide-react';

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
  { icon: Phone, content: '+84 961 243 758' },
  { icon: Mail, content: 'keiverse41@gmail.com' },
  { icon: MapPin, content: 'Thành phố Hồ Chí Minh, Việt Nam' },
];

const socials = [
  { icon: Facebook, href: 'https://www.facebook.com', hover: 'hover:bg-blue-500' },
  { icon: Linkedin, href: 'https://www.linkedin.com', hover: 'hover:bg-blue-700' },
  { icon: Github, href: 'https://www.github.com', hover: 'hover:bg-gray-600' },
  { icon: Youtube, href: 'https://www.youtube.com', hover: 'hover:bg-red-600' },
];

export { navItems, quickLinks, contacts, socials };
