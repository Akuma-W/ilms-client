'use client';

import { useState } from 'react';
import { GuestClassInfo } from '@/features/classes/components/info/guest-class-info';
import { StudentClassInfo } from '@/features/classes/components/info/student-class-info';
import { TeacherClassInfo } from '@/features/classes/components/info/teacher-class-info';
import type { Class } from '@/types/class';
import type { Enrollment } from '@/types/enrollment';
import type { User } from '@/types/user';

interface InfoClientProps {
  classData: Class | null;
  userData: User | null;
  relation: Enrollment | null;
}

/**
 * Main Client component for Class Info tab.
 * Orchestrates role-based views across Guest, Enrolled Student, and Class Teacher.
 */
export function InfoClient({ classData: initialClassData, userData, relation }: InfoClientProps) {
  const [classData, setClassData] = useState<Class | null>(initialClassData);

  if (!classData) return null;

  const isTeacher = Boolean(
    (relation?.roleIn === 'teacher' || classData?.teacherId === userData?.id) && userData,
  );
  const isJoined = Boolean(relation && relation.status === 'approved');

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Case 1: Guest / Non-enrolled user */}
      {!isJoined && !isTeacher && <GuestClassInfo classData={classData} relation={relation} />}

      {/* Case 2: Class Teacher */}
      {isTeacher && userData && (
        <TeacherClassInfo
          classData={classData}
          userData={userData}
          onClassUpdated={(updated) => setClassData(updated)}
        />
      )}

      {/* Case 3: Enrolled Student */}
      {isJoined && !isTeacher && userData && relation && (
        <StudentClassInfo classData={classData} userData={userData} relation={relation} />
      )}
    </div>
  );
}
