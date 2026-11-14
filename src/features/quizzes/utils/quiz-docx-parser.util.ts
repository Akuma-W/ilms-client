import mammoth from 'mammoth';
import type { ParsedOption, ParsedQuestion, ParsedQuizDocx } from '@/types/quiz';
import { QuestionType } from '@/types/enum';

// Extracts raw text from an ArrayBuffer using mammoth in browser runtime
export async function extractDocxText(arrayBuffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value || '';
}

// ─── Regex patterns (compiled once for performance) ───────────────────────────

// Metadata lines: [TÊN ĐỀ THI]: ..., [THỜI GIAN]: ..., [MÔ TẢ]: ...
const TITLE_REGEX = /^\[TÊN ĐỀ THI\]\s*:\s*(.+)$/i;
const TIME_REGEX = /^\[THỜI GIAN\]\s*:\s*(\d+)/i;
const DESC_REGEX = /^\[MÔ TẢ\]\s*:\s*(.+)$/i;

// Question start: "Câu 1:", "Câu 1.", "Câu 1)", "Câu 1 [tag] [1.0 điểm]:"
const QUESTION_START_REGEX = /^Câu\s+\d+[\s:.)]/i;

// Option: "A.", "*A.", "A)", "*A)", with Unicode letter support
const OPTION_REGEX = /^(\*)?([A-Za-z])[\.\)]\s*(.+)$/;

// Explanation line
const EXPLANATION_REGEX = /^(Giải thích|Explanation)\s*:\s*(.+)$/i;

// Answer key: "Đáp án: A, C" or "Answer: A; C"
const ANSWER_KEY_REGEX = /^(?:Đáp án|Answer)\s*:\s*([A-Z](?:\s*[,;]\s*[A-Z])*)$/i;

// Points extraction from bracket: [1.0 điểm]
const POINTS_REGEX = /\[(\d+(?:\.\d+)?)\s*điểm\]/i;

// Section header that marks start of exam content
const CONTENT_SECTION_REGEX = /NỘI DUNG ĐỀ THI/i;

// Noise lines to skip in the guidelines section
const NOISE_LINE_REGEX = /^(HƯỚNG DẪN|=+|\[LƯU Ý|LƯU Ý|\d+\.\s)/;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Strips all bracket tags and "Câu N:" prefix from a question first line */
function cleanQuestionContent(raw: string): string {
  return raw
    .replace(POINTS_REGEX, '')
    .replace(/\[(nhiều đáp án|chọn nhiều|đúng\/sai|true\/false|1 đáp án)\]/gi, '')
    .replace(/^Câu\s+\d+[\s:.)]*/i, '')
    .trim();
}

/** Detects question type from explicit tag in the first line */
function detectTypeFromTag(line: string): QuestionType {
  const lower = line.toLowerCase();
  if (lower.includes('[nhiều đáp án]') || lower.includes('[chọn nhiều]')) {
    return QuestionType.multiple_select;
  }
  if (lower.includes('[đúng/sai]') || lower.includes('[true/false]')) {
    return QuestionType.true_false;
  }
  return QuestionType.multiple_choice;
}

/** Smart fallback: infers type from option distribution when no tag present */
function inferTypeFromOptions(options: ParsedOption[], tagType: QuestionType): QuestionType {
  if (tagType !== QuestionType.multiple_choice) return tagType;

  // 2 options with Đúng/True + Sai/False → true_false
  const isBinary =
    options.length === 2 &&
    options.some((o) => /^(đúng|true)$/i.test(o.content.trim())) &&
    options.some((o) => /^(sai|false)$/i.test(o.content.trim()));
  if (isBinary) return QuestionType.true_false;

  // Multiple starred options → multiple_select
  const correctCount = options.filter((o) => o.isCorrect).length;
  if (correctCount > 1) return QuestionType.multiple_select;

  return QuestionType.multiple_choice;
}

// ─── Core Parser ─────────────────────────────────────────────────────────────

/**
 * Parses raw text content extracted from a Word file into a structured quiz object.
 * Supports both template-based files (with section headers) and plain-text files.
 */
export function parseQuizText(rawText: string): ParsedQuizDocx {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => Boolean(line));

  let title: string | undefined;
  let timeLimit: number | undefined;
  let description: string | undefined;

  const questionBlocks: string[][] = [];
  let currentBlock: string[] = [];

  // Track whether we have passed the content section header
  let isUnderContentSection = false;
  // Track whether the file has a content section header at all
  let hasContentHeader = false;

  for (const line of lines) {
    // Detect content section boundary
    if (CONTENT_SECTION_REGEX.test(line)) {
      isUnderContentSection = true;
      hasContentHeader = true;
      continue;
    }

    // Always try to parse metadata regardless of section
    const titleMatch = line.match(TITLE_REGEX);
    if (titleMatch) {
      title = titleMatch[1].trim();
      continue;
    }

    const timeMatch = line.match(TIME_REGEX);
    if (timeMatch) {
      timeLimit = parseInt(timeMatch[1], 10);
      continue;
    }

    const descMatch = line.match(DESC_REGEX);
    if (descMatch) {
      description = descMatch[1].trim();
      continue;
    }

    // Skip template noise lines only before the content section
    if (!isUnderContentSection && hasContentHeader && NOISE_LINE_REGEX.test(line)) {
      continue;
    }

    // If file has no section header, treat everything after metadata as content
    const inContentArea = isUnderContentSection || !hasContentHeader;
    if (!inContentArea) continue;

    // Split lines into question blocks by detecting a new question start
    if (QUESTION_START_REGEX.test(line)) {
      if (currentBlock.length > 0) {
        questionBlocks.push(currentBlock);
      }
      currentBlock = [line];
    } else if (currentBlock.length > 0) {
      currentBlock.push(line);
    }
  }

  // Push the last block
  if (currentBlock.length > 0) {
    questionBlocks.push(currentBlock);
  }

  // Parse each question block into a structured Question object
  const questions: ParsedQuestion[] = questionBlocks.map((block, idx) => {
    const firstLine = block[0];

    // Extract points
    let points = 1.0;
    const pointsMatch = firstLine.match(POINTS_REGEX);
    if (pointsMatch) {
      points = parseFloat(pointsMatch[1]);
    }

    // Detect type from explicit tag first
    const tagType = detectTypeFromTag(firstLine);

    // Extract clean content from first line
    let content = cleanQuestionContent(firstLine);

    const options: ParsedOption[] = [];
    const optionLabels: string[] = [];
    let answerLabels: string[] | undefined;
    let explanation: string | undefined;

    for (let i = 1; i < block.length; i++) {
      const line = block[i];

      // Check explanation line
      const explMatch = line.match(EXPLANATION_REGEX);
      if (explMatch) {
        explanation = explMatch[2].trim();
        continue;
      }

      const answerMatch = line.match(ANSWER_KEY_REGEX);
      if (answerMatch) {
        answerLabels = answerMatch[1].split(/\s*[,;]\s*/).map((label) => label.toUpperCase());
        continue;
      }

      // Check option pattern
      const optMatch = line.match(OPTION_REGEX);
      if (optMatch) {
        const isMarkedCorrect = Boolean(optMatch[1]);
        optionLabels.push(optMatch[2].toUpperCase());
        const optContent = optMatch[3].trim();
        options.push({ content: optContent, isCorrect: isMarkedCorrect });
        continue;
      }

      // If no options parsed yet, the line is a continuation of question content
      if (options.length === 0) {
        content = `${content} ${line}`.trim();
      }
    }

    if (answerLabels) {
      options.forEach((option, optionIndex) => {
        option.isCorrect = answerLabels.includes(optionLabels[optionIndex]);
      });
    }

    // Apply smart type inference as fallback
    const questionType = inferTypeFromOptions(options, tagType);

    // Fallback: if no option is marked correct, default first option
    const correctCount = options.filter((o) => o.isCorrect).length;
    if (!answerLabels && correctCount === 0 && options.length > 0) {
      options[0] = { ...options[0], isCorrect: true };
    }

    // Normalize true_false options if type changed via inference
    if (questionType === QuestionType.true_false && options.length === 0) {
      options.push({ content: 'Đúng', isCorrect: true });
      options.push({ content: 'Sai', isCorrect: false });
    }

    return {
      content: content || `Câu hỏi số ${idx + 1}`,
      questionType,
      points,
      orderIndex: idx + 1,
      explanation,
      options,
    };
  });

  return { title, timeLimit, description, questions };
}

// Parses an uploaded Word File directly into a structured Quiz
export async function parseQuizDocxFile(file: File): Promise<ParsedQuizDocx> {
  const arrayBuffer = await file.arrayBuffer();
  const rawText = await extractDocxText(arrayBuffer);
  return parseQuizText(rawText);
}
