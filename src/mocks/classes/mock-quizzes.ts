import { QuizStatus, Visibility } from '@/types/enum';
import type { PublishQuizInput, Quiz, QuizClassItem, QuizClassStats } from '@/types/quiz';
import { MOCK_STUDENTS } from './mock-users';

export const MOCK_CLASS_QUIZZES: QuizClassItem[] = [
  {
    id: 'q1000001-0000-4000-8000-000000000001',
    publicationId: 'pub-001',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    topicId: 'b1000001-0000-4000-8000-000000000001',
    topicName: 'Chủ đề 1: Tổng quan CTDL & Giải thuật',
    title: 'Trắc nghiệm 01: Ôn tập Kiến thức nền tảng Cấu trúc dữ liệu & Phân tích Big-O',
    description:
      'Bài kiểm tra trắc nghiệm củng cố kiến thức về độ phức tạp thời gian, không gian và các trường hợp tốt nhất, trung bình, xấu nhất của thuật toán sắp xếp và tìm kiếm.',
    timeLimit: 15,
    visibility: Visibility.public,
    status: QuizStatus.published,
    openAt: '2026-11-05T08:00:00Z',
    closeAt: '2026-11-20T23:59:59Z',
    createdAt: '2026-11-05T07:30:00Z',
    createdBy: '11111111-1111-4111-8111-111111111111',
    questionCount: 15,
    submittedCount: 28,
    totalStudents: 40,
    currentUserAttempt: null, // Chưa làm (còn trong hạn)
  },
  {
    id: 'q1000002-0000-4000-8000-000000000002',
    publicationId: 'pub-002',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    topicId: 'b1000004-0000-4000-8000-000000000004',
    topicName: 'Chủ đề 2: Cây nhị phân & Cây AVL',
    title: 'Trắc nghiệm 02: Khảo sát Cây nhị phân tìm kiếm & Cân bằng AVL Tree',
    description:
      'Bài kiểm tra gồm các câu hỏi trắc nghiệm đánh giá khả năng xác định hệ số cân bằng (Balance Factor) và các phép xoay đơn/kép trên cây AVL.',
    timeLimit: 20,
    visibility: Visibility.public,
    status: QuizStatus.published,
    openAt: '2026-11-01T08:00:00Z',
    closeAt: '2026-11-25T23:59:59Z',
    createdAt: '2026-11-01T07:45:00Z',
    createdBy: '11111111-1111-4111-8111-111111111111',
    questionCount: 20,
    submittedCount: 35,
    totalStudents: 40,
    currentUserAttempt: {
      id: 'qa-002',
      quizId: 'q1000002-0000-4000-8000-000000000002',
      studentId: 'current-user-student-id',
      score: 9.0,
      startedAt: '2026-11-07T19:50:00Z',
      submittedAt: '2026-11-07T20:10:00Z',
    }, // Đã làm còn giờ
  },
  {
    id: 'q1000003-0000-4000-8000-000000000003',
    publicationId: 'pub-003',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    topicId: 'b1000005-0000-4000-8000-000000000005',
    topicName: 'Chủ đề 3: Đồ thị & Các thuật toán duyệt',
    title: 'Trắc nghiệm 03: Thuật toán Đồ thị — Duyệt BFS, DFS và Cây khung nhỏ nhất (MST)',
    description:
      'Đánh giá kỹ năng xác định thứ tự duyệt đỉnh theo BFS/DFS, áp dụng thuật toán Kruskal và Prim tìm cây khung nhỏ nhất trên đồ thị vô hướng có trọng số.',
    timeLimit: 25,
    visibility: Visibility.public,
    status: QuizStatus.published,
    openAt: '2026-11-08T08:00:00Z',
    closeAt: '2026-11-30T23:59:59Z',
    createdAt: '2026-11-08T07:00:00Z',
    createdBy: '11111111-1111-4111-8111-111111111111',
    questionCount: 20,
    submittedCount: 15,
    totalStudents: 40,
    currentUserAttempt: null, // Chưa làm (còn trong hạn)
  },
  {
    id: 'q1000004-0000-4000-8000-000000000004',
    publicationId: 'pub-004',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    topicId: 'b1000006-0000-4000-8000-000000000006',
    topicName: 'Chủ đề 4: Bảng băm & Ứng dụng thực tế',
    title: 'Trắc nghiệm 04: Bảng băm (Hash Table), Hàm băm & Kỹ thuật xử lý đụng độ',
    description:
      'Kiểm tra lý thuyết thiết kế hàm băm phân bố đều, phương pháp thăm dò tuyến tính (Linear Probing), thăm dò bậc hai (Quadratic) và nối kết trực tiếp (Chaining).',
    timeLimit: 15,
    visibility: Visibility.public,
    status: QuizStatus.published,
    openAt: '2026-11-02T08:00:00Z',
    closeAt: '2026-11-15T23:59:59Z',
    createdAt: '2026-11-02T07:15:00Z',
    createdBy: '11111111-1111-4111-8111-111111111111',
    questionCount: 15,
    submittedCount: 38,
    totalStudents: 40,
    currentUserAttempt: {
      id: 'qa-004',
      quizId: 'q1000004-0000-4000-8000-000000000004',
      studentId: 'current-user-student-id',
      score: 8.5,
      startedAt: '2026-11-06T14:10:00Z',
      submittedAt: '2026-11-06T14:25:00Z',
    }, // Đã làm còn giờ
  },
];

export const MOCK_QUIZZES: Quiz[] = MOCK_CLASS_QUIZZES.map((cq) => ({
  id: cq.id,
  title: cq.title,
  description: cq.description,
  timeLimit: cq.timeLimit,
  visibility: cq.visibility,
  status: cq.status,
  openAt: cq.openAt,
  closeAt: cq.closeAt,
  createdAt: cq.createdAt,
  createdBy: cq.createdBy,
  questionCount: cq.questionCount,
  publications: [
    {
      id: cq.publicationId,
      quizId: cq.id,
      classId: cq.classId,
      topicId: cq.topicId || undefined,
      isPublic: cq.visibility === Visibility.public,
      openAt: cq.openAt,
      closeAt: cq.closeAt,
      publishedAt: cq.createdAt,
    },
  ],
  attempts: cq.currentUserAttempt
    ? [
        {
          id: cq.currentUserAttempt.id,
          quizId: cq.id,
          studentId: cq.currentUserAttempt.studentId,
          score: cq.currentUserAttempt.score,
          startedAt: cq.currentUserAttempt.startedAt,
          submittedAt: cq.currentUserAttempt.submittedAt,
        },
      ]
    : [],
}));

let localClassQuizzes: QuizClassItem[] = [...MOCK_CLASS_QUIZZES];

export function getMockClassQuizzes(classId: string): QuizClassItem[] {
  return localClassQuizzes.filter((q) => !classId || q.classId === classId);
}

export function getAllMockQuizzes(): Quiz[] {
  return localClassQuizzes.map((cq) => ({
    id: cq.id,
    title: cq.title,
    description: cq.description,
    timeLimit: cq.timeLimit,
    visibility: cq.visibility,
    status: cq.status,
    openAt: cq.openAt,
    closeAt: cq.closeAt,
    createdAt: cq.createdAt,
    createdBy: cq.createdBy,
    questionCount: cq.questionCount,
  }));
}

export function publishMockQuizToClass(
  classId: string,
  input: PublishQuizInput,
  topicName?: string,
): QuizClassItem {
  const existing = localClassQuizzes.find((q) => q.id === input.quizId);
  const title = existing ? existing.title : 'Bài kiểm tra trắc nghiệm chuyên đề mới';
  const description = existing
    ? existing.description
    : 'Bài trắc nghiệm củng cố kiến thức theo chương trình môn học.';

  const newPublication: QuizClassItem = {
    id: input.quizId,
    publicationId: `pub-${Date.now()}`,
    classId,
    topicId: input.topicId || null,
    topicName: topicName || 'Học phần bổ sung',
    title,
    description,
    timeLimit: existing?.timeLimit || 20,
    visibility: Visibility.public,
    status: QuizStatus.published,
    openAt: input.openAt,
    closeAt: input.closeAt,
    createdAt: new Date().toISOString(),
    createdBy: '11111111-1111-4111-8111-111111111111',
    questionCount: existing?.questionCount || 15,
    submittedCount: 0,
    totalStudents: 40,
    currentUserAttempt: null,
  };

  // Remove old publication if republishing same quiz in same class
  localClassQuizzes = localClassQuizzes.filter(
    (q) => !(q.classId === classId && q.id === input.quizId),
  );
  localClassQuizzes.unshift(newPublication);
  return newPublication;
}

export function unpublishMockQuizFromClass(classId: string, quizId: string): boolean {
  const initialLen = localClassQuizzes.length;
  localClassQuizzes = localClassQuizzes.filter((q) => !(q.classId === classId && q.id === quizId));
  return localClassQuizzes.length < initialLen;
}

/**
 * Returns class evaluation stats for a specific quiz (submitted vs unsubmitted, class average).
 */
export function getMockQuizClassStats(quizId: string): QuizClassStats {
  const quiz = localClassQuizzes.find((q) => q.id === quizId);
  const quizTitle = quiz?.title || 'Bài trắc nghiệm lớp học';
  const totalStudents = 40;
  const submittedCount = quiz?.submittedCount || 28;
  const unsubmittedCount = Math.max(0, totalStudents - submittedCount);

  // Generate mock student submission records
  const sampleScores = [9.5, 9.0, 8.5, 8.0, 7.5, 10.0, 6.5, 7.0, 8.5, 9.0];
  const students = MOCK_STUDENTS.map((st, idx) => {
    const isSubmitted = idx < submittedCount;
    return {
      studentId: st.id,
      fullName: st.fullName,
      email: st.email,
      avatarUrl: st.avatarUrl,
      isSubmitted,
      score: isSubmitted ? sampleScores[idx % sampleScores.length] : null,
      submittedAt: isSubmitted ? '2026-11-06T15:30:00Z' : null,
    };
  });

  return {
    quizId,
    quizTitle,
    submittedCount,
    unsubmittedCount,
    totalStudents,
    averageScore: 8.35,
    passRatePercent: 92.5,
    students,
  };
}
