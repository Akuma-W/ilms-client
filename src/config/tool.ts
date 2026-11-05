import { Brain, RotateCcw } from 'lucide-react';
import type { ToolInformation, ToolIconKey } from '@/types/tool';

export const iconToolMap = {
  random: RotateCcw,
  assistant: Brain,
} as const;

export type IconKey = ToolIconKey;

export const DEFAULT_TOOLS: ToolInformation[] = [
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
