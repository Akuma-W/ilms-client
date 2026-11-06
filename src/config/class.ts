import {
  BarChart,
  BookOpen,
  Edit,
  FileText,
  HelpCircle,
  Info,
  LayoutDashboard,
  MessageSquare,
  Users,
  Wrench,
} from 'lucide-react';

const classNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/classes?tab=discovery' },
  { icon: BookOpen, label: 'Lớp của tôi', href: '/classes?tab=joined' },
  { icon: Wrench, label: 'Công cụ', href: '/tools' },
  { icon: MessageSquare, label: 'Tin nhắn', href: '/chats' },
];

const classesTabItems = [
  { value: 'discovery', label: 'Khám phá' },
  { value: 'joined', label: 'Đã tham gia' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'created', label: 'Đã tạo' },
];

const classTabItems = [
  { value: 'overview', icon: BookOpen, label: 'Tổng quan', joinedOnly: true },
  { value: 'materials', icon: FileText, label: 'Tài liệu', joinedOnly: true },
  { value: 'assignments', icon: Edit, label: 'Bài tập', joinedOnly: true },
  { value: 'quizzes', icon: HelpCircle, label: 'Trắc nghiệm', joinedOnly: true },
  { value: 'forums', icon: MessageSquare, label: 'Diễn đàn', joinedOnly: true },
  { value: 'members', icon: Users, label: 'Thành viên', joinedOnly: true },
  { value: 'grades', icon: BarChart, label: 'Bảng điểm', joinedOnly: true },
  { value: 'info', icon: Info, label: 'Giới thiệu', joinedOnly: false },
];

export { classNavItems, classesTabItems, classTabItems };
