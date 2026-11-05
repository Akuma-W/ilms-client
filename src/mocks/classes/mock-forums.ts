import type { Forum } from '@/types/forum';
import { MOCK_CURRENT_USER, MOCK_STUDENTS, MOCK_TEACHER } from './mock-users';

export const MOCK_FORUMS: Forum[] = [
  {
    id: 'f1000001-0000-4000-8000-000000000001',
    title: 'Thảo luận: Khi nào cây AVL cần thực hiện phép xoay kép (Double Rotation)?',
    content:
      'Chào thầy và các bạn, em đang làm bài tập cài đặt cây AVL nhưng gặp khó khăn khi phân biệt trường hợp Left-Right (LR) và Right-Left (RL). Có mẹo nào để nhận biết ngay nút nào cần xoay trước không ạ?',
    isAnonymous: false,
    isDeleted: false,
    createdAt: '2026-03-10T15:00:00Z',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    createdBy: MOCK_CURRENT_USER.id,
    author: MOCK_CURRENT_USER,
    upvotes: 12,
    commentCount: 2,
    comments: [
      {
        id: 'c1000001-0000-4000-8000-000000000001',
        content:
          'Em vẽ cây ra giấy sẽ thấy ngay dạng hình chữ chi (zigzag). Nếu cây con lệch về một phía thẳng hàng (Left-Left hoặc Right-Right) thì chỉ cần 1 phép xoay đơn. Nếu bị gập khúc (Left-Right hoặc Right-Left), em phải xoay con của nó trước để duỗi thẳng thành một đường, rồi mới xoay nút mất cân bằng.',
        isAnonymous: false,
        isDeleted: false,
        createdAt: '2026-03-10T16:20:00Z',
        forumId: 'f1000001-0000-4000-8000-000000000001',
        authorId: MOCK_TEACHER.id,
        author: MOCK_TEACHER,
        parentId: null,
      },
      {
        id: 'c1000001-0000-4000-8000-000000000002',
        content:
          'Cảm ơn thầy ạ, em hiểu rồi! Hóa ra xoay con là để đưa về trường hợp Left-Left rồi xoay phải là xong.',
        isAnonymous: false,
        isDeleted: false,
        createdAt: '2026-03-10T17:05:00Z',
        forumId: 'f1000001-0000-4000-8000-000000000001',
        authorId: MOCK_CURRENT_USER.id,
        author: MOCK_CURRENT_USER,
        parentId: 'c1000001-0000-4000-8000-000000000001',
      },
    ],
  },
  {
    id: 'f1000002-0000-4000-8000-000000000002',
    title: 'Hỏi về cách tối ưu bộ nhớ Queue khi duyệt BFS trên ma trận lớn (1000x1000)',
    content:
      'Em chạy BFS tìm đường ngắn nhất trên ma trận 1000x1000 thì bị tràn bộ nhớ (Memory Limit Exceeded). Em nên dùng mảng 1D hay kỹ thuật đánh dấu mảng visited thế nào để giảm footprint bộ nhớ ạ?',
    isAnonymous: true,
    isDeleted: false,
    createdAt: '2026-03-12T09:30:00Z',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    createdBy: MOCK_STUDENTS[1].id,
    author: undefined,
    upvotes: 8,
    commentCount: 1,
    comments: [
      {
        id: 'c1000002-0000-4000-8000-000000000001',
        content:
          'Một lỗi rất phổ biến là bạn đánh dấu visited KHI POP khỏi Queue thay vì KHI PUSH vào Queue. Nếu đánh dấu khi pop, cùng một ô có thể bị push vào queue nhiều lần gây nổ bộ nhớ. Hãy đánh dấu ngay khi push nhé!',
        isAnonymous: false,
        isDeleted: false,
        createdAt: '2026-03-12T10:15:00Z',
        forumId: 'f1000002-0000-4000-8000-000000000002',
        authorId: MOCK_STUDENTS[2].id,
        author: MOCK_STUDENTS[2],
        parentId: null,
      },
    ],
  },
  {
    id: 'f1000003-0000-4000-8000-000000000003',
    title: '[Thông báo] Buổi hỏi đáp trực tuyến (Q&A) giải đáp thắc mắc Đồ án giữa kỳ',
    content:
      'Thầy sẽ mở phòng Google Meet vào tối thứ Sáu tuần này (20:00 - 21:30) để giải đáp các vướng mắc về cấu trúc Trie và cài đặt AVL Tree. Các bạn chuẩn bị sẵn câu hỏi nhé.',
    isAnonymous: false,
    isDeleted: false,
    createdAt: '2026-03-14T08:00:00Z',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    createdBy: MOCK_TEACHER.id,
    author: MOCK_TEACHER,
    upvotes: 25,
    commentCount: 0,
    comments: [],
  },
];
