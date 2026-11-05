import { Metadata } from 'next';
import { ToolsClient } from './tools-client';
import { DEFAULT_TOOLS } from '@/config/tool';

export const metadata: Metadata = {
  title: 'Công cụ hỗ trợ',
};

export default function Tools() {
  return <ToolsClient tools={DEFAULT_TOOLS} />;
}
