'use client';

import { useEffect, useState } from 'react';
import {
  Ban,
  Clock,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { membersService } from '@/features/members/services/members.service';
import { useMemberActions } from '@/features/members/hooks/use-member-actions';
import { MemberInstructorTable } from '@/features/members/components/member-instructor-table';
import { MemberStudentTable } from '@/features/members/components/member-student-table';
import { MemberSectionCard } from '@/features/members/components/member-section-card';
import { AddAssistantModal } from '@/features/members/components/add-assistant-modal';
import { EnrollmentStatus, Role } from '@/types/enum';
import type { Class } from '@/types/class';
import type { ClassMember } from '@/types/member';
import { useCurrentUser } from '@/features/user/hooks/use-current-user';
import { cn } from '@/lib/utils';

interface MembersClientProps {
  classData: Class;
  isTeacher: boolean;
}

export function MembersClient({ classData, isTeacher }: MembersClientProps) {
  const { user: currentUser } = useCurrentUser();
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Individual Section Expanse States
  const [isInstructorsOpen, setIsInstructorsOpen] = useState(true);
  const [isApprovedOpen, setIsApprovedOpen] = useState(true);
  const [isPendingOpen, setIsPendingOpen] = useState(true);
  const [isRejectedOpen, setIsRejectedOpen] = useState(false);
  const [isSuspendedOpen, setIsSuspendedOpen] = useState(false);

  // Pagination states for student tables
  const [approvedPage, setApprovedPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);
  const [suspendedPage, setSuspendedPage] = useState(1);

  const isHeadTeacher = Boolean(
    currentUser && (classData.teacherId === currentUser.id || currentUser.role === 'admin'),
  );

  const {
    handleApprove,
    handleReject,
    handleReApprove,
    handleBan,
    handleUnbanAndApprove,
    handleUnbanAndReset,
    handleRemove,
    handleChangeRole,
    handleAssistantAdded,
  } = useMemberActions({ classId: classData.id, setMembers });

  useEffect(() => {
    membersService.getMembers(classData.id).then(setMembers);
  }, [classData.id]);

  // Teachers in class (Head teacher first, then assistants)
  const teachers = members.filter((m) => m.role === Role.teacher);
  const headTeacher = teachers.find((t) => t.userId === classData.teacherId) || teachers[0];
  const assistantTeachers = teachers.filter((t) => t.id !== headTeacher?.id);
  const allInstructors = headTeacher ? [headTeacher, ...assistantTeachers] : teachers;

  // Categorize Student Members into 4 distinct groups
  const studentMembers = members.filter((m) => m.role === Role.student);
  const approvedStudents = studentMembers.filter((s) => s.status === EnrollmentStatus.approved);
  const pendingStudents = studentMembers.filter((s) => s.status === EnrollmentStatus.pending);
  const rejectedStudents = studentMembers.filter((s) => s.status === EnrollmentStatus.rejected);
  const suspendedStudents = studentMembers.filter((s) => s.status === EnrollmentStatus.suspended);

  // Filter helper matching search keyword
  const filterBySearch = (list: ClassMember[]) => {
    if (!searchTerm.trim()) return list;
    const query = searchTerm.toLowerCase().trim();
    return list.filter((m) => {
      const name = (m.user?.fullName || '').toLowerCase();
      const code = (m.studentCode || m.identityCode || m.user?.identityCode || '').toLowerCase();
      const email = (m.user?.email || '').toLowerCase();
      return name.includes(query) || code.includes(query) || email.includes(query);
    });
  };

  const filteredInstructors = filterBySearch(allInstructors);
  const filteredApproved = filterBySearch(approvedStudents);
  const filteredPending = filterBySearch(pendingStudents);
  const filteredRejected = filterBySearch(rejectedStudents);
  const filteredSuspended = filterBySearch(suspendedStudents);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <span>Thành viên lớp học</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản lý và theo dõi danh sách giảng viên, trợ giảng và học sinh theo từng nhóm trạng
            thái.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span
            className={cn(
              'px-3 py-1.5 rounded-xl border text-xs font-semibold',
              classData.maxStudents && approvedStudents.length >= classData.maxStudents
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold'
                : 'bg-muted border-border text-foreground',
            )}
          >
            Sĩ số: <strong>{approvedStudents.length}</strong> / {classData.maxStudents ?? 60} học
            sinh
            {classData.maxStudents &&
              approvedStudents.length >= classData.maxStudents &&
              ' (Đã đủ)'}
          </span>

          {isTeacher && pendingStudents.length > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <strong>{pendingStudents.length}</strong> chờ duyệt
            </span>
          )}

          {isTeacher && suspendedStudents.length > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1.5">
              <Ban className="size-3.5" />
              <strong>{suspendedStudents.length}</strong> bị cấm
            </span>
          )}
        </div>
      </div>

      {/* Global Search Bar across all member groups */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm thành viên theo họ tên, MSSV hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-10 text-xs rounded-xl bg-card border-border/80 shadow-2xs"
        />
      </div>

      {/* SECTION 1: Teacher */}
      <MemberSectionCard
        title="Giảng viên & Trợ giảng"
        icon={ShieldCheck}
        count={allInstructors.length}
        badgeLabel={`${allInstructors.length} người`}
        badgeClassName="border-primary/30 text-primary bg-primary/5 font-bold"
        isOpen={isInstructorsOpen}
        onToggle={() => setIsInstructorsOpen((prev) => !prev)}
        action={
          isHeadTeacher && (
            <AddAssistantModal
              classId={classData.id}
              existingTeacherIds={teachers.map((t) => t.userId)}
              onAssistantAdded={handleAssistantAdded}
            />
          )
        }
      >
        <MemberInstructorTable
          instructors={filteredInstructors}
          headTeacherId={classData.teacherId}
          isHeadTeacher={isHeadTeacher}
          onChangeRole={handleChangeRole}
          onRemove={handleRemove}
          emptyTitle="Chưa có thông tin giảng viên hoặc trợ giảng"
          emptyDescription="Lớp học hiện chưa có thông tin ban giảng huấn hoặc không khớp với từ khóa tìm kiếm."
        />
      </MemberSectionCard>

      {/* SECTION 2: Official Student */}
      <MemberSectionCard
        title="Sinh viên chính thức"
        icon={UserCheck}
        count={approvedStudents.length}
        badgeLabel={`${approvedStudents.length} / ${classData.maxStudents ?? 60}`}
        badgeClassName="border-emerald-500/30 text-emerald-600 bg-emerald-500/5 font-bold"
        isOpen={isApprovedOpen}
        onToggle={() => setIsApprovedOpen((prev) => !prev)}
      >
        <MemberStudentTable
          members={filteredApproved}
          isTeacher={isTeacher}
          canEditRole={isHeadTeacher}
          page={approvedPage}
          onPageChange={setApprovedPage}
          onBan={handleBan}
          onRemove={handleRemove}
          onChangeRole={handleChangeRole}
          emptyTitle="Chưa có sinh viên chính thức"
          emptyDescription="Lớp học chưa có sinh viên nào tham gia hoặc không khớp với kết quả tìm kiếm."
        />
      </MemberSectionCard>

      {/* SECTIONS 3, 4, 5: Only visible to Instructors and Assistants */}
      {isTeacher && (
        <>
          {/* SECTION 3: Pending Student */}
          <MemberSectionCard
            title="Sinh viên chờ phê duyệt"
            icon={Clock}
            count={pendingStudents.length}
            badgeClassName={cn(
              'border-amber-500/30 text-amber-600 bg-amber-500/10 font-bold',
              pendingStudents.length > 0 && 'animate-pulse',
            )}
            isOpen={isPendingOpen}
            onToggle={() => setIsPendingOpen((prev) => !prev)}
          >
            <MemberStudentTable
              members={filteredPending}
              isTeacher={true}
              page={pendingPage}
              onPageChange={setPendingPage}
              onApprove={handleApprove}
              onReject={handleReject}
              onBan={handleBan}
              dateLabel="Ngày yêu cầu"
              emptyTitle="Không có yêu cầu chờ duyệt"
              emptyDescription="Hiện tại không có học sinh nào đang gửi yêu cầu tham gia lớp học."
            />
          </MemberSectionCard>

          {/* SECTION 4: Reject Student */}
          <MemberSectionCard
            title="Sinh viên đã từ chối"
            icon={UserX}
            count={rejectedStudents.length}
            badgeClassName="border-border text-muted-foreground bg-muted/40"
            isOpen={isRejectedOpen}
            onToggle={() => setIsRejectedOpen((prev) => !prev)}
          >
            <MemberStudentTable
              members={filteredRejected}
              isTeacher={true}
              page={rejectedPage}
              onPageChange={setRejectedPage}
              onReApprove={handleReApprove}
              onBan={handleBan}
              onRemove={handleRemove}
              dateLabel="Ngày từ chối"
              emptyTitle="Không có yêu cầu bị từ chối"
              emptyDescription="Chưa có sinh viên nào bị từ chối tham gia lớp học."
            />
          </MemberSectionCard>

          {/* SECTION 5: Banned Student */}
          <MemberSectionCard
            title="Sinh viên bị cấm khỏi lớp"
            icon={ShieldAlert}
            count={suspendedStudents.length}
            badgeClassName="border-destructive/30 text-destructive bg-destructive/10 font-bold"
            isOpen={isSuspendedOpen}
            onToggle={() => setIsSuspendedOpen((prev) => !prev)}
          >
            <MemberStudentTable
              members={filteredSuspended}
              isTeacher={true}
              page={suspendedPage}
              onPageChange={setSuspendedPage}
              onUnbanAndApprove={handleUnbanAndApprove}
              onResetBan={handleUnbanAndReset}
              onRemove={handleRemove}
              dateLabel="Ngày cấm"
              emptyTitle="Không có sinh viên bị cấm"
              emptyDescription="Không có thành viên nào đang bị đình chỉ hoặc chặn khỏi lớp học này."
            />
          </MemberSectionCard>
        </>
      )}
    </div>
  );
}
