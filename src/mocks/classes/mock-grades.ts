import type {
  ClassGradeMatrixRow,
  DetailedGradeItem,
  GradeCategory,
  StudentCategoryGrade,
  StudentGradeRecord,
  StudentGradeSummary,
} from '@/types/grade';
import { MOCK_STUDENTS } from './mock-users';
import {
  calculateFinalScore,
  getGpa4,
  getLetterGrade,
} from '@/features/grades/utils/grade.utils';

export let MOCK_GRADE_CATEGORIES: GradeCategory[] = [
  {
    id: 'cat-attendance',
    name: 'Chuyên cần',
    weight: 0.2, // 20%
    orderIndex: 1,
    classId: 'class-standard',
  },
  {
    id: 'cat-practical',
    name: 'Giữa kì',
    weight: 0.3, // 30%
    orderIndex: 2,
    classId: 'class-standard',
  },
  {
    id: 'cat-final',
    name: 'Cuối kì',
    weight: 0.5, // 50%
    orderIndex: 3,
    classId: 'class-standard',
  },
];

export const MOCK_DETAILED_ITEMS: DetailedGradeItem[] = [
  {
    id: 'd-1',
    title: 'Điểm danh Google Meet 10 buổi',
    type: 'attendance',
    maxScore: 10,
    earnedScore: 9.5,
    status: 'graded',
    feedback: 'Tham gia đầy đủ 9/10 buổi học trực tuyến.',
  },
  {
    id: 'd-2',
    title: 'Bài tập 1: Cài đặt Danh sách liên kết đơn',
    type: 'assignment',
    maxScore: 10,
    earnedScore: 8.5,
    status: 'graded',
    feedback: 'Code sạch sẽ, thuật toán tối ưu tốt.',
  },
  {
    id: 'd-3',
    title: 'Bài tập 2: Cây nhị phân tìm kiếm (BST)',
    type: 'assignment',
    maxScore: 10,
    earnedScore: 9.0,
    status: 'graded',
    feedback: 'Đạt yêu cầu xuất sắc.',
  },
  {
    id: 'd-4',
    title: 'Quiz 1: Ôn tập Độ phức tạp thuật toán O(N)',
    type: 'quiz',
    maxScore: 10,
    earnedScore: 8.0,
    status: 'graded',
    feedback: 'Đúng 8/10 câu hỏi trắc nghiệm.',
  },
  {
    id: 'd-5',
    title: 'Bài kiểm tra cuối kỳ: Cấu trúc dữ liệu & Thuật toán',
    type: 'assignment',
    maxScore: 10,
    earnedScore: 9.0,
    status: 'graded',
    feedback: 'Bài làm rất tốt.',
  },
];

// Mutable in-memory gradebook scores: studentId -> { categoryId -> score }
const mockScoresState: Record<string, Record<string, number | null>> = {
  [MOCK_STUDENTS[0].id]: {
    'cat-attendance': 9.5,
    'cat-practical': 8.5,
    'cat-final': 9.0,
  },
  [MOCK_STUDENTS[1].id]: {
    'cat-attendance': 10.0,
    'cat-practical': 9.0,
    'cat-final': 9.5,
  },
  [MOCK_STUDENTS[2].id]: {
    'cat-attendance': 8.0,
    'cat-practical': 7.5,
    'cat-final': 8.0,
  },
};

// Auto fill scores for remaining students
MOCK_STUDENTS.forEach((student, idx) => {
  if (!mockScoresState[student.id]) {
    const base = 7 + (idx % 3);
    mockScoresState[student.id] = {
      'cat-attendance': Math.min(10, base + 1),
      'cat-practical': base,
      'cat-final': Math.min(10, base + 0.5),
    };
  }
});

export const getMockCategories = (): GradeCategory[] =>
  [...MOCK_GRADE_CATEGORIES].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

export const addMockCategory = (
  name: string,
  weightPercent: number,
  orderIndex?: number,
): GradeCategory => {
  const newCat: GradeCategory = {
    id: `cat-${Date.now()}`,
    name,
    weight: weightPercent > 1 ? weightPercent / 100 : weightPercent,
    orderIndex: orderIndex ?? MOCK_GRADE_CATEGORIES.length + 1,
    classId: 'class-standard',
  };
  MOCK_GRADE_CATEGORIES.push(newCat);
  return newCat;
};

export const updateMockCategory = (
  id: string,
  name: string,
  weightPercent: number,
  orderIndex?: number,
): GradeCategory | null => {
  const cat = MOCK_GRADE_CATEGORIES.find((c) => c.id === id);
  if (cat) {
    cat.name = name;
    cat.weight = weightPercent > 1 ? weightPercent / 100 : weightPercent;
    if (orderIndex !== undefined) {
      cat.orderIndex = orderIndex;
    }
    return { ...cat };
  }
  return null;
};

export const deleteMockCategory = (id: string): boolean => {
  const initialLength = MOCK_GRADE_CATEGORIES.length;
  MOCK_GRADE_CATEGORIES = MOCK_GRADE_CATEGORIES.filter((c) => c.id !== id);
  return MOCK_GRADE_CATEGORIES.length < initialLength;
};

export const getMockStudentRecord = (studentId?: string): StudentGradeRecord => {
  const currentStudent = MOCK_STUDENTS.find((s) => s.id === studentId) || MOCK_STUDENTS[0];
  const studentScores = mockScoresState[currentStudent.id] || {
    'cat-attendance': 9.0,
    'cat-practical': 8.5,
    'cat-final': 8.5,
  };

  const categoryGrades: StudentCategoryGrade[] = MOCK_GRADE_CATEGORIES.map((cat) => {
    const score = studentScores[cat.id] ?? null;
    return {
      categoryId: cat.id,
      categoryName: cat.name,
      weight: cat.weight,
      score,
      weightedScore: score !== null ? Math.round(score * cat.weight * 100) / 100 : null,
    };
  });

  const finalScore = calculateFinalScore(MOCK_GRADE_CATEGORIES, studentScores);

  return {
    studentId: currentStudent.id,
    studentName: currentStudent.fullName,
    studentEmail: currentStudent.email,
    studentCode: '22520101',
    avatarUrl: currentStudent.avatarUrl,
    categoryGrades,
    detailedItems: MOCK_DETAILED_ITEMS,
    finalScore,
    letterGrade: getLetterGrade(finalScore),
    gpa4: getGpa4(finalScore),
    isPassed: finalScore !== null ? finalScore >= 5.0 : null,
    completionRate: 85,
  };
};

export const getMockGradeMatrixRows = (): ClassGradeMatrixRow[] => {
  return MOCK_STUDENTS.map((student, idx) => {
    const scores = mockScoresState[student.id] || {
      'cat-attendance': 8.0,
      'cat-practical': 7.5,
      'cat-final': 8.0,
    };
    const finalScore = calculateFinalScore(MOCK_GRADE_CATEGORIES, scores);

    return {
      studentId: student.id,
      studentName: student.fullName,
      studentEmail: student.email,
      studentCode: `2252${(1001 + idx).toString()}`,
      avatarUrl: student.avatarUrl,
      scores: { ...scores },
      finalScore,
      letterGrade: getLetterGrade(finalScore),
    };
  });
};

export const updateMockBatchScores = (
  updates: { studentId: string; categoryId: string; score: number }[],
) => {
  updates.forEach((u) => {
    if (!mockScoresState[u.studentId]) mockScoresState[u.studentId] = {};
    mockScoresState[u.studentId][u.categoryId] = u.score;
  });
};

// Legacy compatibility for mock-data.mock.ts
export const MOCK_STUDENT_GRADES: StudentGradeSummary[] = MOCK_STUDENTS.map((student, idx) => ({
  studentId: student.id,
  studentName: student.fullName,
  studentEmail: student.email,
  avatarUrl: student.avatarUrl,
  attendanceScore: 9.5,
  assignmentScore: 9.0,
  quizScore: 9.0,
  finalScore: 9.2,
  rank: idx + 1,
}));
