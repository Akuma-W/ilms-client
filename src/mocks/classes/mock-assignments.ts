import { FileType } from '@/types/enum';
import type { Assignment } from '@/types/assignment';
import { MOCK_CURRENT_USER, MOCK_STUDENTS } from './mock-users';

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1000001-0000-4000-8000-000000000001',
    title: 'BTVN 01: Cài đặt và thao tác trên Danh sách liên kết đơn (Singly Linked List)',
    description:
      'Yêu cầu sinh viên viết chương trình C++ hoàn chỉnh định nghĩa cấu trúc Node và lớp SinglyLinkedList với các hàm: insertAtHead, insertAtTail, deleteNode, reverseList và detectCycle. Nộp file mã nguồn .cpp hoặc .zip.',
    dueAt: '2026-11-08T05:00:00Z',
    maxScore: 10,
    createdAt: '2026-11-07T10:00:00Z',
    updatedAt: '2026-11-07T10:00:00Z',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    topicId: 'b1000002-0000-4000-8000-000000000002',
    createdBy: '11111111-1111-4111-8111-111111111111',
    materials: [
      {
        id: 'am100001-0000-4000-8000-000000000001',
        fileUrl: 'https://files.keiverse.edu.vn/assignments/it003/btvn1_de_bai_linked_list.pdf',
        fileType: FileType.pdf,
        assignmentId: 'a1000001-0000-4000-8000-000000000001',
      },
    ],
    submissionCount: 15,
    totalStudents: 15,
    submissions: [
      {
        id: 's1000001-0000-4000-8000-000000000001',
        assignmentId: 'a1000001-0000-4000-8000-000000000001',
        studentId: MOCK_CURRENT_USER.id,
        student: MOCK_CURRENT_USER,
        textAnswer:
          'Em đã hoàn thành đầy đủ 5 yêu cầu và bổ sung thêm hàm in danh sách đẹp mắt. Mã nguồn đã được kiểm tra trên LeetCode chạy trong 0ms.',
        score: 9.5,
        feedback:
          'Bài làm rất tốt, code sạch sẽ, giải thuật đảo ngược danh sách tối ưu O(n) thời gian và O(1) bộ nhớ.',
        isLate: false,
        submittedAt: '2026-02-28T19:30:00Z',
        files: [
          {
            id: 'sf100001-0000-4000-8000-000000000001',
            fileUrl: 'https://files.keiverse.edu.vn/submissions/it003/tran_minh_tuan_btvn1.cpp',
            fileType: FileType.document,
            fileName: 'tran_minh_tuan_btvn1.cpp',
            fileSize: 14500,
            submissionId: 's1000001-0000-4000-8000-000000000001',
          },
        ],
      },
      {
        id: 's1000001-0000-4000-8000-000000000002',
        assignmentId: 'a1000001-0000-4000-8000-000000000001',
        studentId: MOCK_STUDENTS[1].id,
        student: MOCK_STUDENTS[1],
        textAnswer: 'Bài nộp của Lê Thị Mai - Mã số SV: 22520890.',
        score: 10.0,
        feedback: 'Xuất sắc, có bổ sung Unit Test đầy đủ các trường hợp biên!',
        isLate: false,
        submittedAt: '2026-02-28T21:15:00Z',
      },
    ],
  },
  {
    id: 'a1000002-0000-4000-8000-000000000002',
    title: 'BTVN 02: Ứng dụng Ngăn xếp (Stack) & Hàng đợi (Queue) giải quyết bài toán mê cung',
    description:
      'Cài đặt thuật toán tìm đường thoát khỏi ma trận mê cung MxN bằng Queue (BFS tìm đường ngắn nhất) và kiểm tra tính hợp lệ của biểu thức toán học chứa các cặp ngoặc {}, [], () bằng Stack. Đính kèm báo cáo phân tích Big-O.',
    dueAt: '2026-11-25T23:59:59Z',
    maxScore: 10,
    createdAt: '2026-11-07T10:00:00Z',
    updatedAt: '2026-11-07T10:00:00Z',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    topicId: 'b1000003-0000-4000-8000-000000000003',
    createdBy: '11111111-1111-4111-8111-111111111111',
    materials: [
      {
        id: 'am100002-0000-4000-8000-000000000001',
        fileUrl: 'https://files.keiverse.edu.vn/assignments/it003/btvn2_maze_problem_spec.pdf',
        fileType: FileType.pdf,
        assignmentId: 'a1000002-0000-4000-8000-000000000002',
      },
    ],
    submissionCount: 8,
    totalStudents: 15,
    submissions: [
      {
        id: 's1000002-0000-4000-8000-000000000001',
        assignmentId: 'a1000002-0000-4000-8000-000000000002',
        studentId: MOCK_CURRENT_USER.id,
        student: MOCK_CURRENT_USER,
        textAnswer: 'Em đã nộp file code maze_solver.cpp và file báo cáo PDF.',
        score: null,
        feedback: null,
        isLate: false,
        submittedAt: '2026-03-10T14:20:00Z',
        files: [
          {
            id: 'sf100002-0000-4000-8000-000000000001',
            fileUrl:
              'https://files.keiverse.edu.vn/submissions/it003/tran_minh_tuan_maze_solver.cpp',
            fileType: FileType.document,
            fileName: 'tran_minh_tuan_maze_solver.cpp',
            fileSize: 22300,
            submissionId: 's1000002-0000-4000-8000-000000000001',
          },
        ],
      },
    ],
  },
  {
    id: 'a1000003-0000-4000-8000-000000000003',
    title:
      'Đồ án giữa kỳ: Xây dựng Từ điển tự động gợi ý từ (AutoComplete Dictionary) bằng Trie & AVL Tree',
    description:
      'Xây dựng ứng dụng hoàn chỉnh cho phép nạp kho từ vựng tiếng Anh (50.000 từ), hỗ trợ tìm kiếm nhanh theo tiền tố O(L) với cây Trie, và lưu trữ nghĩa của từ theo cây AVL cân bằng để tra cứu O(log N). Đánh giá hiệu năng và viết báo cáo kỹ thuật.',
    dueAt: '2026-04-10T23:59:59Z',
    maxScore: 10,
    createdAt: '2026-03-09T10:00:00Z',
    updatedAt: '2026-03-09T10:00:00Z',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    topicId: 'b1000004-0000-4000-8000-000000000004',
    createdBy: '11111111-1111-4111-8111-111111111111',
    materials: [
      {
        id: 'am100003-0000-4000-8000-000000000001',
        fileUrl: 'https://files.keiverse.edu.vn/assignments/it003/do_an_giua_ky_trie_avl.pdf',
        fileType: FileType.pdf,
        assignmentId: 'a1000003-0000-4000-8000-000000000003',
      },
    ],
    submissionCount: 2,
    totalStudents: 15,
    submissions: [],
  },
];
