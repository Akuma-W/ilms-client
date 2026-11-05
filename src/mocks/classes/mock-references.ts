import type { Reference } from '@/types/topic';

export const MOCK_REFERENCES: Reference[] = [
  // Topic 1 References
  {
    id: 'r1000001-0000-4000-8000-000000000001',
    title: 'Giáo trình Cấu trúc dữ liệu và Giải thuật (ĐH Quốc gia TP.HCM)',
    url: 'https://elib.uit.edu.vn/giao-trinh-ctdl-gt.pdf',
    description: 'Sách giáo trình chính quy chuẩn hóa cho sinh viên khối ngành kỹ thuật phần mềm.',
    topicId: 'b1000001-0000-4000-8000-000000000001',
    createdAt: '2026-02-16T09:00:00Z',
  },
  {
    id: 'r1000001-0000-4000-8000-000000000002',
    title: 'Big-O Cheat Sheet - Tổng hợp độ phức tạp thời gian & không gian',
    url: 'https://www.bigocheatsheet.com/',
    description:
      'Bảng tra cứu trực quan độ phức tạp của các cấu trúc dữ liệu và giải thuật sắp xếp thông dụng.',
    topicId: 'b1000001-0000-4000-8000-000000000001',
    createdAt: '2026-02-16T09:15:00Z',
  },

  // Topic 2 References
  {
    id: 'r1000002-0000-4000-8000-000000000001',
    title: 'VisuAlgo - Trực quan hóa tương tác Danh sách liên kết',
    url: 'https://visualgo.net/en/list',
    description: 'Công cụ mô phỏng động các thao tác Insert, Delete, Search trên Linked List.',
    topicId: 'b1000002-0000-4000-8000-000000000002',
    createdAt: '2026-02-23T09:15:00Z',
  },
  {
    id: 'r1000002-0000-4000-8000-000000000002',
    title: 'GeeksforGeeks: Comprehensive Guide to Doubly Linked List',
    url: 'https://www.geeksforgeeks.org/doubly-linked-list/',
    description:
      'Tài liệu hướng dẫn chi tiết cách cài đặt và giải quyết các bài toán phỏng vấn kinh điển.',
    topicId: 'b1000002-0000-4000-8000-000000000002',
    createdAt: '2026-02-23T09:30:00Z',
  },

  // Topic 3 References
  {
    id: 'r1000003-0000-4000-8000-000000000001',
    title: 'VisuAlgo - Trực quan hóa tương tác Ngăn xếp & Hàng đợi',
    url: 'https://visualgo.net/en/stackqueue',
    description: 'Mô phỏng cơ chế Push/Pop của Stack và Enqueue/Dequeue của Queue.',
    topicId: 'b1000003-0000-4000-8000-000000000003',
    createdAt: '2026-03-02T09:00:00Z',
  },
  {
    id: 'r1000003-0000-4000-8000-000000000002',
    title: 'LeetCode Problem #20: Valid Parentheses (Bài toán ngoặc hợp lệ)',
    url: 'https://leetcode.com/problems/valid-parentheses/',
    description: 'Bài toán kinh điển ứng dụng Stack để kiểm tra tính hợp lệ của dấu đóng mở ngoặc.',
    topicId: 'b1000003-0000-4000-8000-000000000003',
    createdAt: '2026-03-02T09:15:00Z',
  },

  // Topic 4 References
  {
    id: 'r1000004-0000-4000-8000-000000000001',
    title: 'VisuAlgo - Mô phỏng cân bằng cây tự động AVL Tree',
    url: 'https://visualgo.net/en/bst',
    description:
      'Xem trực quan các phép xoay Left-Left, Right-Right, Left-Right, Right-Left khi thêm nút.',
    topicId: 'b1000004-0000-4000-8000-000000000004',
    createdAt: '2026-03-09T09:00:00Z',
  },
  {
    id: 'r1000004-0000-4000-8000-000000000002',
    title: 'Stanford University CS166: Balanced Binary Search Trees Notes',
    url: 'https://web.stanford.edu/class/cs166/lectures/00/Small00.pdf',
    description: 'Bài giảng lý thuyết chuyên sâu về cây nhị phân cân bằng từ Đại học Stanford.',
    topicId: 'b1000004-0000-4000-8000-000000000004',
    createdAt: '2026-03-09T09:20:00Z',
  },

  // Topic 5 References
  {
    id: 'r1000005-0000-4000-8000-000000000001',
    title: 'VisuAlgo - Trực quan hóa thuật toán đồ thị Graph Traversal',
    url: 'https://visualgo.net/en/dfsbfs',
    description: 'Mô phỏng thuật toán BFS và DFS từng bước trên đồ thị có hướng và vô hướng.',
    topicId: 'b1000005-0000-4000-8000-000000000005',
    createdAt: '2026-03-16T09:00:00Z',
  },
];
