import { QuestionType, QuizStatus, Visibility } from '@/types/enum';
import type { Quiz } from '@/types/quiz';

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'q1000001-0000-4000-8000-000000000001',
    title: 'Trắc nghiệm 01: Ôn tập Kiến thức nền tảng Cấu trúc dữ liệu & Phân tích Big-O',
    description:
      'Bài kiểm tra trắc nghiệm củng cố kiến thức về độ phức tạp thời gian, không gian và các trường hợp tốt nhất, trung bình, xấu nhất của thuật toán sắp xếp và tìm kiếm.',
    timeLimit: 15,
    visibility: Visibility.public,
    status: QuizStatus.published,
    openAt: '2026-02-16T08:00:00Z',
    closeAt: '2026-03-31T23:59:59Z',
    createdAt: '2026-02-16T07:30:00Z',
    createdBy: '11111111-1111-4111-8111-111111111111',
    questionCount: 3,
    questions: [
      {
        id: 'qn100001-0000-4000-8000-000000000001',
        content:
          'Độ phức tạp thời gian trong trường hợp xấu nhất của thuật toán Tìm kiếm nhị phân (Binary Search) trên mảng đã sắp xếp gồm N phần tử là gì?',
        questionType: QuestionType.multiple_choice,
        points: 3.33,
        orderIndex: 1,
        options: [
          { id: 'op100001', content: 'O(1)', isCorrect: false },
          { id: 'op100002', content: 'O(log N)', isCorrect: true },
          { id: 'op100003', content: 'O(N)', isCorrect: false },
          { id: 'op100004', content: 'O(N log N)', isCorrect: false },
        ],
      },
      {
        id: 'qn100001-0000-4000-8000-000000000002',
        content:
          'Trong các thuật toán sắp xếp sau, những thuật toán nào có độ phức tạp thời gian trung bình là O(N log N)? (Chọn tất cả đáp án đúng)',
        questionType: QuestionType.multiple_select,
        points: 3.33,
        orderIndex: 2,
        options: [
          { id: 'op100005', content: 'Merge Sort', isCorrect: true },
          { id: 'op100006', content: 'Quick Sort', isCorrect: true },
          { id: 'op100007', content: 'Bubble Sort', isCorrect: false },
          { id: 'op100008', content: 'Heap Sort', isCorrect: true },
        ],
      },
      {
        id: 'qn100001-0000-4000-8000-000000000003',
        content:
          'Thao tác chèn một phần tử vào đầu danh sách liên kết đơn có độ phức tạp thời gian là O(1).',
        questionType: QuestionType.true_false,
        points: 3.34,
        orderIndex: 3,
        options: [
          { id: 'op100009', content: 'Đúng', isCorrect: true },
          { id: 'op100010', content: 'Sai', isCorrect: false },
        ],
      },
    ],
    publications: [
      {
        id: 'qp100001-0000-4000-8000-000000000001',
        quizId: 'q1000001-0000-4000-8000-000000000001',
        classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
        topicId: 'b1000001-0000-4000-8000-000000000001',
        isPublic: true,
        openAt: '2026-02-16T08:00:00Z',
        closeAt: '2026-03-31T23:59:59Z',
        publishedAt: '2026-02-16T08:00:00Z',
      },
    ],
    attempts: [
      {
        id: 'qa100001-0000-4000-8000-000000000001',
        quizId: 'q1000001-0000-4000-8000-000000000001',
        studentId: '22222222-2222-4222-8222-222222222221',
        score: 10.0,
        startedAt: '2026-02-18T20:00:00Z',
        submittedAt: '2026-02-18T20:12:30Z',
      },
    ],
  },
  {
    id: 'q1000002-0000-4000-8000-000000000002',
    title: 'Trắc nghiệm 02: Khảo sát Cây nhị phân tìm kiếm & Cân bằng AVL Tree',
    description:
      'Bài kiểm tra gồm các câu hỏi trắc nghiệm đánh giá khả năng xác định hệ số cân bằng (Balance Factor) và các phép xoay đơn/kép trên cây AVL.',
    timeLimit: 20,
    visibility: Visibility.public,
    status: QuizStatus.published,
    openAt: '2026-03-09T08:00:00Z',
    closeAt: '2026-04-15T23:59:59Z',
    createdAt: '2026-03-09T07:45:00Z',
    createdBy: '11111111-1111-4111-8111-111111111111',
    questionCount: 3,
    questions: [
      {
        id: 'qn100002-0000-4000-8000-000000000001',
        content:
          'Hệ số cân bằng (Balance Factor) của một nút trong cây AVL được tính theo công thức nào?',
        questionType: QuestionType.multiple_choice,
        points: 3.33,
        orderIndex: 1,
        options: [
          {
            id: 'op100011',
            content: 'Chiều cao cây con trái - Chiều cao cây con phải',
            isCorrect: true,
          },
          {
            id: 'op100012',
            content: 'Số nút cây con trái - Số nút cây con phải',
            isCorrect: false,
          },
          {
            id: 'op100013',
            content: 'Chiều cao cây con phải - Chiều cao cây con trái + 1',
            isCorrect: false,
          },
          {
            id: 'op100014',
            content: 'Tổng số lá bên trái / Tổng số lá bên phải',
            isCorrect: false,
          },
        ],
      },
      {
        id: 'qn100002-0000-4000-8000-000000000002',
        content:
          'Một cây AVL hợp lệ chỉ được phép có hệ số cân bằng tại mỗi nút nhận các giá trị nào sau đây?',
        questionType: QuestionType.multiple_choice,
        points: 3.33,
        orderIndex: 2,
        options: [
          { id: 'op100015', content: '-1, 0, 1', isCorrect: true },
          { id: 'op100016', content: '-2, 0, 2', isCorrect: false },
          { id: 'op100017', content: 'Chỉ bằng 0', isCorrect: false },
          { id: 'op100018', content: '0 hoặc 1', isCorrect: false },
        ],
      },
      {
        id: 'qn100002-0000-4000-8000-000000000003',
        content:
          'Trường hợp mất cân bằng Left-Right (LR) trong cây AVL được giải quyết bằng phép xoay đơn sang phải (Single Right Rotation).',
        questionType: QuestionType.true_false,
        points: 3.34,
        orderIndex: 3,
        options: [
          { id: 'op100019', content: 'Đúng', isCorrect: false },
          {
            id: 'op100020',
            content: 'Sai (Phải xoay kép Left-Right: xoay trái con trước, rồi xoay phải nút cha)',
            isCorrect: true,
          },
        ],
      },
    ],
    publications: [
      {
        id: 'qp100002-0000-4000-8000-000000000002',
        quizId: 'q1000002-0000-4000-8000-000000000002',
        classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
        topicId: 'b1000004-0000-4000-8000-000000000004',
        isPublic: true,
        openAt: '2026-03-09T08:00:00Z',
        closeAt: '2026-04-15T23:59:59Z',
        publishedAt: '2026-03-09T08:00:00Z',
      },
    ],
    attempts: [],
  },
];
