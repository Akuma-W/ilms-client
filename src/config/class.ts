import { BookOpen, LayoutDashboard, MessageSquare, Wrench } from 'lucide-react';

const classNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/classes?tab=discovery' },
  { icon: BookOpen, label: 'Lớp của tôi', href: '/classes?tab=joined' },
  { icon: Wrench, label: 'Công cụ', href: '/tools' },
  { icon: MessageSquare, label: 'Tin nhắn', href: '/chats' },
];

export { classNavItems };
