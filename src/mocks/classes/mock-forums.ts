import { Role } from '@/types/enum';
import type {
  Comment,
  CreateCommentInput,
  CreateForumInput,
  Forum,
  UpdateCommentInput,
  UpdateForumInput,
} from '@/types/forum';
import type { User } from '@/types/user';
import { MOCK_CURRENT_USER, MOCK_STUDENTS, MOCK_TEACHER } from './mock-users';

export const MOCK_FORUMS: Forum[] = [
  {
    id: 'f1000001-0000-4000-8000-000000000001',
    title: '[Hỏi bài] Khi nào cây AVL cần thực hiện phép xoay kép (Double Rotation)?',
    content:
      'Chào thầy và các bạn, em đang làm bài tập cài đặt cây AVL nhưng gặp khó khăn khi phân biệt trường hợp Left-Right (LR) và Right-Left (RL). Có mẹo nào để nhận biết ngay nút nào cần xoay trước không ạ?',
    isAnonymous: false,
    isDeleted: false,
    createdAt: '2026-03-10T15:00:00Z',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    createdBy: MOCK_CURRENT_USER.id,
    author: MOCK_CURRENT_USER,
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
        replies: [
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
    ],
  },
  {
    id: 'f1000002-0000-4000-8000-000000000002',
    title: '[Hỏi bài] Cách tối ưu bộ nhớ Queue khi duyệt BFS trên ma trận lớn (1000x1000)',
    content:
      'Em chạy BFS tìm đường ngắn nhất trên ma trận 1000x1000 thì bị tràn bộ nhớ (Memory Limit Exceeded). Em nên dùng mảng 1D hay kỹ thuật đánh dấu mảng visited thế nào để giảm footprint bộ nhớ ạ?',
    isAnonymous: true,
    isDeleted: false,
    createdAt: '2026-03-12T09:30:00Z',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    createdBy: MOCK_STUDENTS[1].id,
    author: undefined,
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
      'Thầy sẽ mở phòng Google Meet vào tối thứ Sáu tuần này (20:00 - 21:30) để giải đáp các vướng mắc về cấu trúc Trie và cài đặt AVL Tree. Các bạn chuẩn bị sẵn câu hỏi trước nhé.',
    isAnonymous: false,
    isDeleted: false,
    createdAt: '2026-03-14T08:00:00Z',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    createdBy: MOCK_TEACHER.id,
    author: MOCK_TEACHER,
    commentCount: 0,
    comments: [],
  },
  {
    id: 'f1000004-0000-4000-8000-000000000004',
    title: '[Thảo luận] Nên dùng Map hay Tự cài Hash Table cho bài tập Word Frequency?',
    content:
      'Em thấy dùng std::unordered_map trong C++ rất tiện, nhưng bài này yêu cầu tự giải quyết xung đột bằng phương pháp Separate Chaining. Mọi người có cấu trúc Node mẫu cho linked list trong bucket không ạ?',
    isAnonymous: false,
    isDeleted: false,
    createdAt: '2026-03-15T11:20:00Z',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    createdBy: MOCK_CURRENT_USER.id,
    author: MOCK_CURRENT_USER,
    commentCount: 0,
    comments: [],
  },
  {
    id: 'f1000004-0000-4000-8000-000000000005',
    title: '[Thảo luận] Nên dùng Map hay Tự cài Hash Table cho bài tập Word Frequency?',
    content:
      'Em thấy dùng std::unordered_map trong C++ rất tiện, nhưng bài này yêu cầu tự giải quyết xung đột bằng phương pháp Separate Chaining. Mọi người có cấu trúc Node mẫu cho linked list trong bucket không ạ?',
    isAnonymous: false,
    isDeleted: false,
    createdAt: '2026-03-15T11:20:00Z',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    createdBy: MOCK_CURRENT_USER.id,
    author: MOCK_CURRENT_USER,
    commentCount: 0,
    comments: [],
  },
  {
    id: 'f1000004-0000-4000-8000-000000000006',
    title: '[Thảo luận] Nên dùng Map hay Tự cài Hash Table cho bài tập Word Frequency?',
    content:
      'Em thấy dùng std::unordered_map trong C++ rất tiện, nhưng bài này yêu cầu tự giải quyết xung đột bằng phương pháp Separate Chaining. Mọi người có cấu trúc Node mẫu cho linked list trong bucket không ạ?',
    isAnonymous: false,
    isDeleted: false,
    createdAt: '2026-03-15T11:20:00Z',
    classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
    createdBy: MOCK_CURRENT_USER.id,
    author: MOCK_CURRENT_USER,
    commentCount: 0,
    comments: [],
  },
];

let localForums: Forum[] = [...MOCK_FORUMS];

export function getMockForums(classId: string): Forum[] {
  return localForums
    .filter((f) => f.classId === classId && !f.isDeleted)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getMockForumById(forumId: string): Forum | null {
  const forum = localForums.find((f) => f.id === forumId && !f.isDeleted);
  return forum ? { ...forum } : null;
}

export function createMockForum(classId: string, input: CreateForumInput, user: User): Forum {
  const newForum: Forum = {
    id: `f-${Date.now()}`,
    title: input.title,
    content: input.content,
    isAnonymous: user.role === Role.student ? Boolean(input.isAnonymous) : false,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    classId,
    createdBy: user.id,
    author: input.isAnonymous ? undefined : user,
    commentCount: 0,
    comments: [],
  };

  localForums = [newForum, ...localForums];
  return newForum;
}

export function createMockComment(input: CreateCommentInput, user: User): Comment {
  const newComment: Comment = {
    id: `c-${Date.now()}`,
    content: input.content,
    isAnonymous: user.role === Role.student ? Boolean(input.isAnonymous) : false,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    forumId: input.forumId,
    authorId: user.id,
    author: input.isAnonymous ? undefined : user,
    parentId: input.parentId || null,
    replies: [],
  };

  localForums = localForums.map((f) => {
    if (f.id !== input.forumId) return f;

    const existingComments = f.comments || [];
    if (input.parentId) {
      // Append to parent comment's replies
      const updatedComments = existingComments.map((c) => {
        if (c.id === input.parentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newComment],
          };
        }
        return c;
      });
      return {
        ...f,
        comments: updatedComments,
        commentCount: (f.commentCount || 0) + 1,
      };
    }

    return {
      ...f,
      comments: [...existingComments, newComment],
      commentCount: (f.commentCount || 0) + 1,
    };
  });

  return newComment;
}

export function updateMockForum(forumId: string, input: UpdateForumInput): Forum | null {
  let updatedForum: Forum | null = null;
  localForums = localForums.map((f) => {
    if (f.id !== forumId) return f;
    updatedForum = {
      ...f,
      ...(input.title !== undefined && { title: input.title }),
      ...(input.content !== undefined && { content: input.content }),
      ...(input.isAnonymous !== undefined && { isAnonymous: input.isAnonymous }),
      updatedAt: new Date().toISOString(),
    };
    return updatedForum;
  });
  return updatedForum;
}

export function updateMockComment(
  forumId: string,
  commentId: string,
  input: UpdateCommentInput,
): Comment | null {
  let updatedComment: Comment | null = null;
  const now = new Date().toISOString();

  localForums = localForums.map((f) => {
    if (f.id !== forumId) return f;

    const updatedComments = (f.comments || []).map((c) => {
      if (c.id === commentId) {
        updatedComment = {
          ...c,
          content: input.content,
          updatedAt: now,
        };
        return updatedComment;
      }
      if (c.replies) {
        const updatedReplies = c.replies.map((r) => {
          if (r.id === commentId) {
            updatedComment = {
              ...r,
              content: input.content,
              updatedAt: now,
            };
            return updatedComment;
          }
          return r;
        });
        return { ...c, replies: updatedReplies };
      }
      return c;
    });

    return { ...f, comments: updatedComments };
  });

  return updatedComment;
}

export function deleteMockForum(forumId: string): boolean {
  const initialLen = localForums.length;
  localForums = localForums.filter((f) => f.id !== forumId);
  return localForums.length < initialLen;
}

export function deleteMockComment(forumId: string, commentId: string): boolean {
  let deleted = false;
  localForums = localForums.map((f) => {
    if (f.id !== forumId) return f;

    const updatedComments: Comment[] = [];

    for (const c of f.comments || []) {
      if (c.id === commentId) {
        deleted = true;
        // If it has child replies, preserve as soft deleted so children are still readable
        if (c.replies && c.replies.length > 0) {
          updatedComments.push({
            ...c,
            isDeleted: true,
            content: '[Bình luận này đã bị xóa]',
          });
        }
        // If no child replies, remove cleanly
        continue;
      }

      if (c.replies && c.replies.length > 0) {
        const remainingReplies = c.replies.filter((r) => {
          if (r.id === commentId) {
            deleted = true;
            return false;
          }
          return true;
        });
        updatedComments.push({ ...c, replies: remainingReplies });
      } else {
        updatedComments.push(c);
      }
    }

    return {
      ...f,
      comments: updatedComments,
      commentCount: Math.max(0, (f.commentCount || 1) - (deleted ? 1 : 0)),
    };
  });

  return deleted;
}
