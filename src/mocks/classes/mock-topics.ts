import type { Topic } from '@/types/topic';
import { MOCK_MATERIALS } from './mock-materials';
import { MOCK_REFERENCES } from './mock-references';
import { MOCK_ASSIGNMENTS } from './mock-assignments';
import { MOCK_QUIZZES } from './mock-quizzes';

const CLASS_ID = 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a';
const TEACHER_ID = '11111111-1111-4111-8111-111111111111';

export const MOCK_TOPICS: Topic[] = [
  {
    id: 'b1000001-0000-4000-8000-000000000001',
    title: 'Chủ đề 01: Tổng quan Cấu trúc dữ liệu & Phân tích độ phức tạp Big-O',
    description:
      'Nắm vững khái niệm về cấu trúc dữ liệu, giải thuật, độ phức tạp thời gian & không gian (Big-O, Big-Omega, Big-Theta). Phân biệt các lớp bài toán O(1), O(log N), O(N), O(N log N) và O(N^2).',
    orderIndex: 1,
    classId: CLASS_ID,
    createdBy: TEACHER_ID,
    createdAt: '2026-02-16T08:00:00Z',
    materials: MOCK_MATERIALS.filter((m) => m.topicId === 'b1000001-0000-4000-8000-000000000001'),
    references: MOCK_REFERENCES.filter((r) => r.topicId === 'b1000001-0000-4000-8000-000000000001'),
    assignments: MOCK_ASSIGNMENTS.filter(
      (a) => a.topicId === 'b1000001-0000-4000-8000-000000000001',
    ),
    quizzes: MOCK_QUIZZES.filter((q) =>
      q.publications?.some((p) => p.topicId === 'b1000001-0000-4000-8000-000000000001'),
    ),
  },
  {
    id: 'b1000002-0000-4000-8000-000000000002',
    title: 'Chủ đề 02: Mảng động & Danh sách liên kết (Linked Lists)',
    description:
      'Tìm hiểu về cơ chế quản lý bộ nhớ heap, con trỏ trong C++, cài đặt Singly Linked List, Doubly Linked List và Circular Linked List. So sánh ưu/nhược điểm giữa Array và Linked List.',
    orderIndex: 2,
    classId: CLASS_ID,
    createdBy: TEACHER_ID,
    createdAt: '2026-02-23T08:00:00Z',
    materials: MOCK_MATERIALS.filter((m) => m.topicId === 'b1000002-0000-4000-8000-000000000002'),
    references: MOCK_REFERENCES.filter((r) => r.topicId === 'b1000002-0000-4000-8000-000000000002'),
    assignments: MOCK_ASSIGNMENTS.filter(
      (a) => a.topicId === 'b1000002-0000-4000-8000-000000000002',
    ),
    quizzes: MOCK_QUIZZES.filter((q) =>
      q.publications?.some((p) => p.topicId === 'b1000002-0000-4000-8000-000000000002'),
    ),
  },
  {
    id: 'b1000003-0000-4000-8000-000000000003',
    title: 'Chủ đề 03: Ngăn xếp (Stack) & Hàng đợi (Queue) - Ứng dụng thực tế',
    description:
      'Cơ chế LIFO và FIFO. Ứng dụng Stack trong chuyển đổi biểu thức Infix sang Postfix, kiểm tra ngoặc hợp lệ và quản lý Call Stack. Ứng dụng Queue trong điều phối tiến trình CPU và giải thuật tìm kiếm BFS.',
    orderIndex: 3,
    classId: CLASS_ID,
    createdBy: TEACHER_ID,
    createdAt: '2026-03-02T08:00:00Z',
    materials: MOCK_MATERIALS.filter((m) => m.topicId === 'b1000003-0000-4000-8000-000000000003'),
    references: MOCK_REFERENCES.filter((r) => r.topicId === 'b1000003-0000-4000-8000-000000000003'),
    assignments: MOCK_ASSIGNMENTS.filter(
      (a) => a.topicId === 'b1000003-0000-4000-8000-000000000003',
    ),
    quizzes: MOCK_QUIZZES.filter((q) =>
      q.publications?.some((p) => p.topicId === 'b1000003-0000-4000-8000-000000000003'),
    ),
  },
  {
    id: 'b1000004-0000-4000-8000-000000000004',
    title: 'Chủ đề 04: Cây nhị phân tìm kiếm (BST) & Cây cân bằng AVL',
    description:
      'Định nghĩa cây nhị phân, các thứ tự duyệt Pre-order, In-order, Post-order. Tính chất cây BST và sự suy biến cây thành danh sách liên kết. Giải pháp tự cân bằng bằng cây AVL với 4 phép xoay (LL, RR, LR, RL).',
    orderIndex: 4,
    classId: CLASS_ID,
    createdBy: TEACHER_ID,
    createdAt: '2026-03-09T08:00:00Z',
    materials: MOCK_MATERIALS.filter((m) => m.topicId === 'b1000004-0000-4000-8000-000000000004'),
    references: MOCK_REFERENCES.filter((r) => r.topicId === 'b1000004-0000-4000-8000-000000000004'),
    assignments: MOCK_ASSIGNMENTS.filter(
      (a) => a.topicId === 'b1000004-0000-4000-8000-000000000004',
    ),
    quizzes: MOCK_QUIZZES.filter((q) =>
      q.publications?.some((p) => p.topicId === 'b1000004-0000-4000-8000-000000000004'),
    ),
  },
  {
    id: 'b1000005-0000-4000-8000-000000000005',
    title: 'Chủ đề 05: Đồ thị (Graphs) & Thuật toán duyệt DFS / BFS',
    description:
      'Các cách biểu diễn đồ thị bằng Ma trận kề (Adjacency Matrix) và Danh sách kề (Adjacency List). Cài đặt và ứng dụng của Depth-First Search (DFS) và Breadth-First Search (BFS) trong bài toán tìm đường và chu trình.',
    orderIndex: 5,
    classId: CLASS_ID,
    createdBy: TEACHER_ID,
    createdAt: '2026-03-16T08:00:00Z',
    materials: MOCK_MATERIALS.filter((m) => m.topicId === 'b1000005-0000-4000-8000-000000000005'),
    references: MOCK_REFERENCES.filter((r) => r.topicId === 'b1000005-0000-4000-8000-000000000005'),
    assignments: MOCK_ASSIGNMENTS.filter(
      (a) => a.topicId === 'b1000005-0000-4000-8000-000000000005',
    ),
    quizzes: MOCK_QUIZZES.filter((q) =>
      q.publications?.some((p) => p.topicId === 'b1000005-0000-4000-8000-000000000005'),
    ),
  },
];
