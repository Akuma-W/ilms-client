'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDeleteModal } from '@/components/common/confirm-delete-modal';
import { ForumDetailView } from '@/features/forums/components/forum-detail-view';
import { CommentInput } from '@/features/forums/components/comment-input';
import { CommentItem } from '@/features/forums/components/comment-item';
import { CreateForumModal } from '@/features/forums/components/create-forum-modal';
import { forumsService } from '@/features/forums/services/forums.service';
import { commentsService } from '@/features/forums/services/comments.service';
import type {
  CreateCommentFormData,
  CreateForumFormData,
} from '@/features/forums/schemas/forum.schema';
import type { Comment, Forum } from '@/types/forum';
import type { User } from '@/types/user';

interface ForumDetailClientProps {
  initialForum: Forum;
  classId: string;
  isTeacher: boolean;
  currentUser?: User | null;
}

/**
 * Client component for Single Discussion Topic details.
 * Manages post view, comments list before input, unified replies, soft deletes, and topic editing.
 */
export function ForumDetailClient({
  initialForum,
  classId,
  isTeacher,
  currentUser,
}: ForumDetailClientProps) {
  const router = useRouter();
  const [forum, setForum] = useState<Forum>(initialForum);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Unified reply state
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    authorName: string;
  } | null>(null);
  const composerRef = useRef<HTMLDivElement>(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    isDeleting: boolean;
  }>({
    isOpen: false,
    isDeleting: false,
  });

  const commentsList = forum.comments || [];
  const rootComments = commentsList.filter((c) => !c.parentId);

  const handleTriggerReply = (commentId: string, authorName: string) => {
    setReplyingTo({ commentId, authorName });
    composerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddComment = async (data: CreateCommentFormData) => {
    const res = await commentsService.createComment({
      forumId: forum.id,
      content: data.content,
      isAnonymous: data.isAnonymous,
      parentId: data.parentId || null,
    });

    if (res.success && res.data) {
      toast.success(res.message);
      const newComment = res.data as Comment;

      setForum((prev) => {
        const prevComments = prev.comments || [];
        if (data.parentId) {
          // Add into nested replies of the parent comment
          const updated = prevComments.map((c) => {
            if (c.id === data.parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newComment],
              };
            }
            return c;
          });
          return {
            ...prev,
            comments: updated,
            commentCount: (prev.commentCount || 0) + 1,
          };
        }

        // Add to root comments
        return {
          ...prev,
          comments: [...prevComments, newComment],
          commentCount: (prev.commentCount || 0) + 1,
        };
      });
      setReplyingTo(null);
    } else {
      toast.error('Không thể gửi bình luận. Vui lòng thử lại!');
    }
  };

  const handleEditComment = async (commentId: string, newContent: string) => {
    const res = await commentsService.updateComment(forum.id, commentId, { content: newContent });
    if (res.success) {
      toast.success(res.message);
      const now = new Date().toISOString();
      setForum((prev) => {
        const updatedComments = (prev.comments || []).map((c) => {
          if (c.id === commentId) {
            return { ...c, content: newContent, updatedAt: now };
          }
          if (c.replies) {
            const updatedReplies = c.replies.map((r) => {
              if (r.id === commentId) {
                return { ...r, content: newContent, updatedAt: now };
              }
              return r;
            });
            return { ...c, replies: updatedReplies };
          }
          return c;
        });
        return { ...prev, comments: updatedComments };
      });
    } else {
      toast.error('Không thể cập nhật bình luận!');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const res = await commentsService.deleteComment(forum.id, commentId);
    if (res.success) {
      toast.success(res.message);
      setForum((prev) => {
        let countDelta = 0;
        const updatedComments: Comment[] = [];

        for (const c of prev.comments || []) {
          if (c.id === commentId) {
            countDelta++;
            // If it has child replies, preserve as soft deleted so children are still readable
            if (c.replies && c.replies.length > 0) {
              updatedComments.push({
                ...c,
                isDeleted: true,
                content: '[Bình luận này đã bị xóa]',
              });
            }
            continue;
          }

          if (c.replies && c.replies.length > 0) {
            const remainingReplies = c.replies.filter((r) => {
              if (r.id === commentId) {
                countDelta++;
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
          ...prev,
          comments: updatedComments,
          commentCount: Math.max(0, (prev.commentCount || 1) - countDelta),
        };
      });
    } else {
      toast.error('Xóa bình luận thất bại. Vui lòng thử lại!');
    }
  };

  const handleUpdateForum = async (data: CreateForumFormData) => {
    const res = await forumsService.updateForum(forum.id, data);
    if (res.success && res.data) {
      toast.success(res.message);
      setForum(res.data);
    } else {
      toast.error('Cập nhật bài thảo luận thất bại!');
    }
  };

  const handleConfirmDeleteForum = async () => {
    setDeleteModal({ isOpen: true, isDeleting: true });
    try {
      const res = await forumsService.deleteForum(forum.id);
      if (res.success) {
        toast.success(res.message);
        router.push(`/classes/${classId}/forums`);
      }
    } catch {
      toast.error('Xóa bài thảo luận thất bại!');
      setDeleteModal({ isOpen: false, isDeleting: false });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* 1. Main Forum Post (Supports Edit & Delete) */}
      <ForumDetailView
        forum={forum}
        classId={classId}
        currentUser={currentUser}
        isTeacher={isTeacher}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={() => setDeleteModal({ isOpen: true, isDeleting: false })}
      />

      {/* 2. Threaded Discussion Section (Shown BEFORE comment composer) */}
      <div className="space-y-4 pt-4 border-t border-border/60">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">
            Bình luận & Phản hồi ({commentsList.length})
          </h3>
        </div>

        {rootComments.length === 0 ? (
          <div className="py-10 px-4 text-center rounded-2xl border border-dashed border-border bg-card/50 space-y-2">
            <Sparkles className="size-8 text-primary mx-auto opacity-70" />
            <h4 className="text-sm font-bold text-foreground">Chưa có câu trả lời nào</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Hãy là người đầu tiên chia sẻ góc nhìn hoặc giải đáp thắc mắc cho chủ đề này!
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-165 overflow-y-auto pr-1">
            {rootComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                forumId={forum.id}
                currentUser={currentUser}
                isTeacher={isTeacher}
                onTriggerReply={handleTriggerReply}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
              />
            ))}
          </div>
        )}
      </div>

      {/* 3. Unified Comment / Reply Composer (Positioned at the bottom) */}
      <div ref={composerRef} className="space-y-2 pt-2">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
          <MessageSquare className="size-4 text-primary" />
          <span>
            {replyingTo
              ? `Trả lời phản hồi của @${replyingTo.authorName}`
              : 'Để lại câu trả lời hoặc thảo luận'}
          </span>
        </h3>
        <CommentInput
          forumId={forum.id}
          currentUser={currentUser}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          onSubmit={handleAddComment}
        />
      </div>

      {/* Edit Forum Modal */}
      <CreateForumModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleUpdateForum}
        currentUser={currentUser}
        forumToEdit={forum}
      />

      {/* Universal Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onOpenChange={(open) => setDeleteModal({ isOpen: open, isDeleting: false })}
        title="Xác nhận xóa chủ đề thảo luận"
        description={`Bạn có chắc chắn muốn xóa bài thảo luận "${forum.title}" không? Toàn bộ các câu trả lời liên quan cũng sẽ bị xóa vĩnh viễn.`}
        itemTypeLabel="chủ đề thảo luận"
        itemName={forum.title}
        isDeleting={deleteModal.isDeleting}
        onConfirm={handleConfirmDeleteForum}
      />
    </div>
  );
}
