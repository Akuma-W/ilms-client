import { Brain, RotateCcw } from 'lucide-react';

export const iconToolMap = {
  random: RotateCcw,
  assistant: Brain,
} as const;

type IconKey = keyof typeof iconToolMap;

export interface ToolInfomation {
  title: string;
  description: string;
  icon: IconKey;
  href: string;
  color: string;
  bg: string;
}

export const ClassTabs = {
  DISCOVERY: 'discovery',
  JOINED: 'joined',
  PENDING: 'pending',
  CREATED: 'created',
} as const;

export type ClassTabs = (typeof ClassTabs)[keyof typeof ClassTabs];
