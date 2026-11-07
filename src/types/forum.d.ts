import type { User } from './user';

export type ForumFilterTab = 'all' | 'unanswered' | 'my_posts';

export interface Comment {
  id: string;
  content: string;
  isAnonymous: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  forumId: string;
  authorId: string;
  parentId?: string | null;
  author?: User;
  replies?: Comment[];
}

export interface Forum {
  id: string;
  title: string;
  content: string;
  isAnonymous: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  classId: string;
  createdBy: string;
  author?: User;
  comments?: Comment[];
  commentCount?: number;
}

export interface CreateForumInput {
  title: string;
  content: string;
  isAnonymous?: boolean;
}

export interface CreateCommentInput {
  forumId: string;
  content: string;
  isAnonymous?: boolean;
  parentId?: string | null;
}

export interface UpdateForumInput {
  title?: string;
  content?: string;
  isAnonymous?: boolean;
}

export interface UpdateCommentInput {
  content: string;
}
