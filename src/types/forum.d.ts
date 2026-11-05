import { User } from './user';

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
  classId: string;
  createdBy: string;
  author?: User;
  comments?: Comment[];
  commentCount?: number;
  upvotes?: number;
}
