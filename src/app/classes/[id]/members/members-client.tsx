'use client';

import { useEffect, useState } from 'react';
import { Clock, Search, ShieldCheck, UserCheck, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { membersService } from '@/features/members/services/members.service';
import { MemberTeacherCard } from '@/features/members/components/member-teacher-card';
import { MemberStudentTable } from '@/features/members/components/member-student-table';
import { EnrollmentStatus, Role } from '@/types/enum';
import type { Class } from '@/types/class';
import type { ClassMember, MemberFilterTab } from '@/types/member';
import type { User } from '@/types/user';

interface MembersClientProps {
  classData: Class;
  isTeacher: boolean;
  currentUser?: User | null;
}

/**
 * Main Client component for Class Members tab.
 * Manages instructors section, student list, search filtering, and role modifications.
 */
export function MembersClient({ classData, isTeacher, currentUser }: MembersClientProps) {
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<MemberFilterTab>('all');
  const [page, setPage] = useState(1);

  const isHeadTeacher = Boolean(
    currentUser && (classData.teacherId === currentUser.id || currentUser.role === 'admin'),
  );

  useEffect(() => {
    membersService.getMembers(classData.id).then(setMembers);
  }, [classData.id]);

  // Teachers in class
  const teachers = members.filter((m) => m.role === Role.teacher);
  const headTeacher = teachers.find((t) => t.userId === classData.teacherId) || teachers[0];
  const assistantTeachers = teachers.filter((t) => t.id !== headTeacher?.id);

  // Student members
  const studentMembers = members.filter((m) => m.role === Role.student);
  const approvedStudents = studentMembers.filter((s) => s.status === EnrollmentStatus.approved);
  const pendingStudents = studentMembers.filter((s) => s.status === EnrollmentStatus.pending);

  // Student view only sees approved students; teacher sees all (approved + pending)
  const visibleStudentPool = isTeacher ? studentMembers : approvedStudents;

  // Filtered students by search and tab
  const filteredStudents = visibleStudentPool.filter((member) => {
    const studentName = member.user.fullName.toLowerCase();
    const studentCode = (member.studentCode || '').toLowerCase();
    const studentEmail = member.user.email.toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch =
      studentName.includes(query) || studentCode.includes(query) || studentEmail.includes(query);

    if (filterTab === 'students') {
      return matchesSearch && member.status === EnrollmentStatus.approved;
    }
    if (filterTab === 'pending' && isTeacher) {
      return matchesSearch && member.status === EnrollmentStatus.pending;
    }
    return matchesSearch;
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleTabChange = (tab: MemberFilterTab) => {
    setFilterTab(tab);
    setPage(1);
  };

  const handleApprove = async (memberId: string) => {
    const res = await membersService.approveMember(classData.id, memberId);
    if (res.success) {
      toast.success(res.message);
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: EnrollmentStatus.approved } : m)),
      );
    }
  };

  const handleReject = async (memberId: string) => {
    const res = await membersService.rejectMember(classData.id, memberId);
    if (res.success) {
      toast.success(res.message);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };

  const handleRemove = async (memberId: string) => {
    const res = await membersService.removeMember(classData.id, memberId);
    if (res.success) {
      toast.success(res.message);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };

  const handleChangeRole = async (memberId: string, newRole: Role) => {
    const res = await membersService.updateMemberRole(classData.id, memberId, newRole);
    if (res.success) {
      toast.success(res.message);
      setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
    }
  };

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
            Quản lý danh sách giảng viên, trợ giảng và học sinh tham gia lớp.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-xl bg-muted border border-border text-foreground">
            Tổng cộng: <strong>{approvedStudents.length}</strong> học sinh
          </span>
          {isTeacher && pendingStudents.length > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <strong>{pendingStudents.length}</strong> chờ duyệt
            </span>
          )}
        </div>
      </div>

      {/* 2. Teachers Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
          <ShieldCheck className="size-4 text-primary" />
          Giảng viên & Trợ giảng
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {headTeacher && <MemberTeacherCard teacher={headTeacher.user} isHead={true} />}
          {assistantTeachers.map((t) => (
            <MemberTeacherCard
              key={t.id}
              teacher={t.user}
              isHead={false}
              canEdit={isHeadTeacher}
              onChangeRole={(newRole) => handleChangeRole(t.id, newRole)}
              onRemove={() => handleRemove(t.id)}
            />
          ))}
        </div>
      </div>

      {/* 3. Students Section Toolbar */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider self-start sm:self-auto">
            <UserCheck className="size-4 text-blue-500" />
            Danh sách học sinh ({approvedStudents.length})
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm tên hoặc MSSV..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl"
              />
            </div>

            {/* Filter Tabs (Only shown for teachers to filter pending vs approved) */}
            {isTeacher && (
              <div className="flex items-center gap-1 self-end sm:self-auto">
                <Button
                  type="button"
                  variant={filterTab === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTabChange('all')}
                  className="h-8 text-xs rounded-xl font-medium"
                >
                  Tất cả ({studentMembers.length})
                </Button>
                <Button
                  type="button"
                  variant={filterTab === 'students' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTabChange('students')}
                  className="h-8 text-xs rounded-xl font-medium"
                >
                  Chính thức ({approvedStudents.length})
                </Button>
                <Button
                  type="button"
                  variant={filterTab === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTabChange('pending')}
                  className="h-8 text-xs rounded-xl font-medium relative"
                >
                  Chờ duyệt ({pendingStudents.length})
                  {pendingStudents.length > 0 && (
                    <span className="size-2 rounded-full bg-destructive absolute -top-0.5 -right-0.5" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 4. Student Table */}
        <MemberStudentTable
          members={filteredStudents}
          isTeacher={isTeacher}
          canEditRole={isHeadTeacher}
          page={page}
          onPageChange={setPage}
          onApprove={handleApprove}
          onReject={handleReject}
          onRemove={handleRemove}
          onChangeRole={handleChangeRole}
        />
      </div>
    </div>
  );
}
