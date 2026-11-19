'use client';

import { useState } from 'react';
import { GuestClassInfo } from '@/features/classes/components/info/guest-class-info';
import { StudentClassInfo } from '@/features/classes/components/info/student-class-info';
import { TeacherClassInfo } from '@/features/classes/components/info/teacher-class-info';
import type { Class } from '@/types/class';
import type { Enrollment } from '@/types/enrollment';
import { useCurrentUser } from '@/features/user/hooks/use-current-user';

interface InfoClientProps {
  initialClassData: Class | null;
  relation: Enrollment | null;
}

export function InfoClient({ initialClassData, relation }: InfoClientProps) {
  const { user: currentUser } = useCurrentUser();
  const [classData, setClassData] = useState<Class | null>(initialClassData);

  if (!classData) return null;

  const isTeacher = Boolean(
    (relation?.roleIn === 'teacher' || classData?.teacherId === currentUser?.id) && currentUser,
  );
  const roleCanEdit = isTeacher || currentUser?.role === 'admin';
  const isJoined = Boolean(relation && relation.status === 'approved');

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Case 1: Guest / Non-enrolled user */}
      {!isJoined && !roleCanEdit && <GuestClassInfo classData={classData} relation={relation} />}

      {/* Case 2: Class Teacher */}
      {roleCanEdit && currentUser && (
        <TeacherClassInfo
          classData={classData}
          userData={currentUser}
          onClassUpdated={(updated) => setClassData(updated)}
        />
      )}

      {/* Case 3: Enrolled Student */}
      {isJoined && !roleCanEdit && currentUser && relation && (
        <StudentClassInfo classData={classData} userData={currentUser} relation={relation} />
      )}
    </div>
  );
}
