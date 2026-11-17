// Calculate remaining seconds based on wall-clock time
export function calcRemainingSeconds(startedAt: string | Date, timeLimitMinutes: number): number {
  if (!timeLimitMinutes || timeLimitMinutes <= 0) return 0;
  const startTime = new Date(startedAt).getTime();
  const deadline = startTime + timeLimitMinutes * 60 * 1000;
  const remaining = Math.floor((deadline - Date.now()) / 1000);
  return Math.max(0, remaining);
}

// Format seconds into mm:ss or hh:mm:ss
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return '00:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }
  return `${pad(minutes)}:${pad(secs)}`;
}

export interface QuizDraftData {
  answers: Record<string, string[]>;
  currentIndex: number;
  lastUpdated?: number;
}

// Safely persist student quiz taking progress to localStorage
export function saveQuizDraft(storageKey: string, data: QuizDraftData): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = JSON.stringify({ ...data, lastUpdated: Date.now() });
    localStorage.setItem(storageKey, payload);
  } catch {
    // Ignore quota errors
  }
}

// Load persisted draft state from localStorage
export function loadQuizDraft(storageKey: string): QuizDraftData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw) as QuizDraftData;
  } catch {
    return null;
  }
}

// Clear quiz draft after submission
export function clearQuizDraft(storageKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // Ignore storage deletion errors
  }
}
