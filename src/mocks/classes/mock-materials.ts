import { FileType } from '@/types/enum';
import type { Material } from '@/types/material';

export const MOCK_MATERIALS: Material[] = [
  // Topic 1 Materials
  {
    id: 'm1000001-0000-4000-8000-000000000001',
    title: 'Bài giảng 01: Tổng quan cấu trúc dữ liệu & Đánh giá độ phức tạp thuật toán Big-O',
    materialType: FileType.video,
    fileUrl: null,
    externalUrl: 'https://www.youtube.com/watch?v=kPRA0W1kECg',
    topicId: 'b1000001-0000-4000-8000-000000000001',
    createdAt: '2026-02-16T08:00:00Z',
  },
  {
    id: 'm1000001-0000-4000-8000-000000000002',
    title: 'Slide bài giảng Tuần 1: Không gian bộ nhớ và Phân tích tiệm cận (PDF)',
    materialType: FileType.slide,
    fileUrl: 'https://files.keiverse.edu.vn/materials/it003/tuan1-big-o-analysis.pdf',
    externalUrl: null,
    topicId: 'b1000001-0000-4000-8000-000000000001',
    createdAt: '2026-02-16T08:30:00Z',
  },

  // Topic 2 Materials
  {
    id: 'm1000002-0000-4000-8000-000000000001',
    title:
      'Bài giảng 02: Kỹ thuật cấp phát động & Cài đặt Danh sách liên kết đơn (Singly Linked List)',
    materialType: FileType.video,
    fileUrl: null,
    externalUrl: 'https://www.youtube.com/watch?v=njTh_OwMljA',
    topicId: 'b1000002-0000-4000-8000-000000000002',
    createdAt: '2026-02-23T08:00:00Z',
  },
  {
    id: 'm1000002-0000-4000-8000-000000000002',
    title: 'Slide bài giảng Tuần 2: Danh sách liên kết đôi và Danh sách vòng (PDF)',
    materialType: FileType.slide,
    fileUrl: 'https://files.keiverse.edu.vn/materials/it003/tuan2-linked-lists.pdf',
    externalUrl: null,
    topicId: 'b1000002-0000-4000-8000-000000000002',
    createdAt: '2026-02-23T08:30:00Z',
  },
  {
    id: 'm1000002-0000-4000-8000-000000000003',
    title: 'Mã nguồn minh họa: C++ Template cho Doubly Linked List',
    materialType: FileType.document,
    fileUrl: 'https://files.keiverse.edu.vn/materials/it003/doubly_linked_list_template.cpp',
    externalUrl: null,
    topicId: 'b1000002-0000-4000-8000-000000000002',
    createdAt: '2026-02-23T09:00:00Z',
  },

  // Topic 3 Materials
  {
    id: 'm1000003-0000-4000-8000-000000000001',
    title: 'Bài giảng 03: Ngăn xếp (Stack) & Hàng đợi (Queue) - Nguyên lý LIFO / FIFO',
    materialType: FileType.video,
    fileUrl: null,
    externalUrl: 'https://www.youtube.com/watch?v=F1F2imiOJfk',
    topicId: 'b1000003-0000-4000-8000-000000000003',
    createdAt: '2026-03-02T08:00:00Z',
  },
  {
    id: 'm1000003-0000-4000-8000-000000000002',
    title: 'Slide bài giảng Tuần 3: Hàng đợi ưu tiên (Priority Queue) & Circular Queue',
    materialType: FileType.slide,
    fileUrl: 'https://files.keiverse.edu.vn/materials/it003/tuan3-stack-queue.pdf',
    externalUrl: null,
    topicId: 'b1000003-0000-4000-8000-000000000003',
    createdAt: '2026-03-02T08:30:00Z',
  },

  // Topic 4 Materials
  {
    id: 'm1000004-0000-4000-8000-000000000001',
    title: 'Bài giảng 04: Cây nhị phân tìm kiếm (Binary Search Tree) & Thao tác chèn/xóa/duyệt',
    materialType: FileType.video,
    fileUrl: null,
    externalUrl: 'https://www.youtube.com/watch?v=pYT9F8_LFTM',
    topicId: 'b1000004-0000-4000-8000-000000000004',
    createdAt: '2026-03-09T08:00:00Z',
  },
  {
    id: 'm1000004-0000-4000-8000-000000000002',
    title: 'Slide bài giảng Tuần 4: Cây AVL - Các phép xoay đơn và xoay kép cân bằng cây',
    materialType: FileType.slide,
    fileUrl: 'https://files.keiverse.edu.vn/materials/it003/tuan4-bst-avl-tree.pdf',
    externalUrl: null,
    topicId: 'b1000004-0000-4000-8000-000000000004',
    createdAt: '2026-03-09T08:30:00Z',
  },

  // Topic 5 Materials
  {
    id: 'm1000005-0000-4000-8000-000000000001',
    title:
      'Bài giảng 05: Biểu diễn đồ thị & Thuật toán duyệt theo chiều sâu (DFS) / chiều rộng (BFS)',
    materialType: FileType.video,
    fileUrl: null,
    externalUrl: 'https://www.youtube.com/watch?v=pcKY4hjDrxk',
    topicId: 'b1000005-0000-4000-8000-000000000005',
    createdAt: '2026-03-16T08:00:00Z',
  },
  {
    id: 'm1000005-0000-4000-8000-000000000002',
    title: 'Slide bài giảng Tuần 5: Thuật toán tìm đường đi ngắn nhất Dijkstra',
    materialType: FileType.slide,
    fileUrl: 'https://files.keiverse.edu.vn/materials/it003/tuan5-graphs-dijkstra.pdf',
    externalUrl: null,
    topicId: 'b1000005-0000-4000-8000-000000000005',
    createdAt: '2026-03-16T08:30:00Z',
  },
];
