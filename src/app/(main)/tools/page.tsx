import { Metadata } from 'next';
import { ToolsClient } from './tools-client';
import { ToolInfomation } from '@/types';

export const metadata: Metadata = {
  title: 'Công cụ hỗ trợ',
};

const tools: ToolInfomation[] = [
  {
    title: 'Vòng xoay ngẫu nhiên',
    description: 'Tạo lựa chọn ngẫu nhiên nhanh chóng cho học tập và giải trí.',
    icon: 'random',
    href: '/tools/random',
    color: 'text-galaxy-blue',
    bg: 'bg-galaxy-blue/10',
  },
  {
    title: 'Trợ lý AI',
    description: 'Hỗ trợ học tập, giải đáp câu hỏi và định hướng kỹ năng.',
    icon: 'assistant',
    href: '/tools/assistant',
    color: 'text-galaxy-purple',
    bg: 'bg-galaxy-purple/10',
  },
];

export default function Tools() {
  return <ToolsClient tools={tools} />;
}
