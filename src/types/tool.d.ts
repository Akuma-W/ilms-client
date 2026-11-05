export type ToolIconKey = 'random' | 'assistant';

export interface ToolInformation {
  title: string;
  description: string;
  icon: ToolIconKey;
  href: string;
  color: string;
  bg: string;
}

// Backwards compatibility alias for previous typo
export type ToolInfomation = ToolInformation;
