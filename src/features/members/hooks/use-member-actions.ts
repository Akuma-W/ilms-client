'use client';

import { toast } from 'sonner';
import { membersService } from '../services/members.service';
import { EnrollmentStatus, Role } from '@/types/enum';
import type { ClassMember } from '@/types/member';
import type { User } from '@/types/user';

interface UseMemberActionsProps {
  classId: string;
  setMembers: React.Dispatch<React.SetStateAction<ClassMember[]>>;
}

export function useMemberActions({ classId, setMembers }: UseMemberActionsProps) {
  const handleApprove = async (memberId: string) => {
    const res = await membersService.approveMember(classId, memberId);
    if (res.success) {
      toast.success(res.message);
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: EnrollmentStatus.approved } : m)),
      );
    }
  };

  const handleReject = async (memberId: string) => {
    const res = await membersService.rejectMember(classId, memberId);
    if (res.success) {
      toast.success(res.message);
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: EnrollmentStatus.rejected } : m)),
      );
    }
  };

  const handleReApprove = async (memberId: string) => {
    const res = await membersService.reApproveMember(classId, memberId);
    if (res.success) {
      toast.success(res.message);
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: EnrollmentStatus.approved } : m)),
      );
    }
  };

  const handleBan = async (memberId: string) => {
    const res = await membersService.banMember(classId, memberId);
    if (res.success) {
      toast.success(res.message);
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: EnrollmentStatus.suspended } : m)),
      );
    }
  };

  const handleUnbanAndApprove = async (memberId: string) => {
    const res = await membersService.unbanMember(classId, memberId, false);
    if (res.success) {
      toast.success(res.message);
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: EnrollmentStatus.approved } : m)),
      );
    }
  };

  const handleUnbanAndReset = async (memberId: string) => {
    const res = await membersService.unbanMember(classId, memberId, true);
    if (res.success) {
      toast.success(res.message);
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: EnrollmentStatus.rejected } : m)),
      );
    }
  };

  const handleRemove = async (memberId: string) => {
    const res = await membersService.removeMember(classId, memberId);
    if (res.success) {
      toast.success(res.message);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };

  const handleChangeRole = async (memberId: string, newRole: Role) => {
    const res = await membersService.updateMemberRole(classId, memberId, newRole);
    if (res.success) {
      toast.success(res.message);
      setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
    }
  };

  const handleAssistantAdded = (teacherUser: User) => {
    const newMember: ClassMember = {
      id: `mem-${Date.now()}`,
      userId: teacherUser.id,
      user: teacherUser,
      role: Role.teacher,
      status: EnrollmentStatus.approved,
      joinedAt: new Date().toISOString(),
      studentCode: teacherUser.identityCode || undefined,
    };
    setMembers((prev) => [newMember, ...prev]);
  };

  return {
    handleApprove,
    handleReject,
    handleReApprove,
    handleBan,
    handleUnban: handleUnbanAndApprove,
    handleUnbanAndApprove,
    handleUnbanAndReset,
    handleRemove,
    handleChangeRole,
    handleAssistantAdded,
  };
}
