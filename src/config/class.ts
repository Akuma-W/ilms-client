import { BookOpen, LayoutDashboard, MessageSquare, Wrench } from 'lucide-react';

const classNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/classes?tab=discovery' },
  { icon: BookOpen, label: 'Lớp của tôi', href: '/classes?tab=joined' },
  { icon: Wrench, label: 'Công cụ', href: '/tools' },
  { icon: MessageSquare, label: 'Tin nhắn', href: '/chats' },
];

const classTabItems = [
  { value: 'discovery', label: 'Khám phá' },
  { value: 'joined', label: 'Đã tham gia' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'created', label: 'Đã tạo' },
];

export { classNavItems, classTabItems };
