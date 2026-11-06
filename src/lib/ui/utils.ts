import { CLASS_THEMES } from '@/config';
import type { ClassTheme } from '@/types/class';

/**
 * Deterministically computes a hash index (0..CLASS_THEMES.length - 1) from an input string.
 */
function hashStringToThemeIndex(str?: string | null): number {
  if (!str || typeof str !== 'string') return 0;
  const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return Math.abs(hash) % CLASS_THEMES.length;
}

/**
 * Returns complete theme configuration for any title or entity name.
 */
export function getThemeFromTitle(title?: string | null): ClassTheme {
  const index = hashStringToThemeIndex(title);
  return CLASS_THEMES[index];
}

/**
 * Returns consistent theme for a Class (by title or class object).
 */
export function getClassTheme(
  classDataOrTitle?: { title?: string | null } | string | null,
): ClassTheme {
  const title = typeof classDataOrTitle === 'string' ? classDataOrTitle : classDataOrTitle?.title;
  return getThemeFromTitle(title);
}

/**
 * Returns consistent theme for a Subject (by subject name).
 * Ensures all classes of the same subject share the identical subject theme.
 */
export function getSubjectTheme(subject?: string | null): ClassTheme {
  return getThemeFromTitle(subject);
}
