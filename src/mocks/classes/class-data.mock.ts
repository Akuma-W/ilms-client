import { EnrollmentStatus, SchoolStatus } from '@/types/enum';
import type { ClassClient } from '@/types/class';
import type { Topic } from '@/types/topic';
import type { Material } from '@/types/material';
import type { Reference } from '@/types/reference';
import type { Assignment } from '@/types/assignment';
import type { Quiz } from '@/types/quiz';
import type { Forum } from '@/types/forum';
import type { StudentGradeSummary } from '@/types/grade';
import type { School } from '@/types/school';
import type { Enrollment } from '@/types/enrollment';

import { MOCK_TEACHER, MOCK_CURRENT_USER, MOCK_STUDENTS, MOCK_PENDING_USERS } from './mock-users';
import { MOCK_TOPICS } from './mock-topics';
import { MOCK_MATERIALS } from './mock-materials';
import { MOCK_REFERENCES } from './mock-references';
import { MOCK_ASSIGNMENTS } from './mock-assignments';
import { MOCK_QUIZZES } from './mock-quizzes';
import { MOCK_FORUMS } from './mock-forums';
import { MOCK_GRADE_CATEGORIES, MOCK_STUDENT_GRADES } from './mock-grades';
import { MOCK_MEMBERS, type ClassMemberItem } from './mock-members';

export const MOCK_SCHOOL: School = {
  id: '99999999-9999-4999-8999-999999999999',
  name: 'Trường Đại học Công nghệ Thông tin - ĐHQG TP.HCM',
  shortname: 'UIT',
  address: 'Khu phố 6, P. Linh Trung, TP. Thủ Đức',
  city: 'TP. Hồ Chí Minh',
  status: SchoolStatus.active,
  createdAt: new Date('2020-01-01'),
};

export const MOCK_ENROLLMENT: Enrollment = {
  id: 'en100001-0000-4000-8000-000000000001',
  userId: MOCK_CURRENT_USER.id,
  classId: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
  roleIn: 'student',
  isStarred: true,
  status: EnrollmentStatus.approved,
  joinedAt: new Date('2026-02-15'),
};

export const MOCK_CURRENT_CLASS: ClassClient = {
  id: 'a2b6d7c4-7bdd-41b7-9793-c89bd99d3d2a',
  title: 'IT003: Cấu trúc dữ liệu và Giải thuật',
  subject: 'Khoa học máy tính',
  description:
    'Môn học trang bị kiến thức nền tảng về cấu trúc dữ liệu (Array, LinkedList, Stack, Queue, Tree, Graph) và các giải thuật tối ưu trong lập trình hiện đại.',
  courseCode: 'CS003A',
  semester: 'Học kỳ 1 - 2026-2027',
  isPrivate: false,
  meetingUri: 'https://meet.google.com/xyz-qwert-abc',
  meetingSpaceId: 'spaces/123456789',
  isArchived: false,
  schoolId: MOCK_SCHOOL.id,
  teacherId: MOCK_TEACHER.id,
  createdAt: new Date('2026-02-10'),

  school: MOCK_SCHOOL,
  teacher: MOCK_TEACHER,
  enrollment: MOCK_ENROLLMENT,
  totalStudents: 32,

  schoolName: MOCK_SCHOOL.name,
  teacherName: MOCK_TEACHER.fullName,
  status: 'approved',
  isOwner: false,
};

// Re-export all modular mock data
export {
  MOCK_TEACHER,
  MOCK_CURRENT_USER,
  MOCK_STUDENTS,
  MOCK_PENDING_USERS,
  MOCK_TOPICS,
  MOCK_MATERIALS,
  MOCK_REFERENCES,
  MOCK_ASSIGNMENTS,
  MOCK_QUIZZES,
  MOCK_FORUMS,
  MOCK_GRADE_CATEGORIES,
  MOCK_STUDENT_GRADES,
  MOCK_MEMBERS,
};
export type { ClassMemberItem };

// Mock data helper query functions
export function getMockClass(classId?: string): ClassClient {
  if (classId && classId !== MOCK_CURRENT_CLASS.id) {
    return { ...MOCK_CURRENT_CLASS, id: classId };
  }
  return MOCK_CURRENT_CLASS;
}

export function getMockTopics(classId?: string): Topic[] {
  if (classId) {
    const matched = MOCK_TOPICS.filter((t) => t.classId === classId);
    if (matched.length > 0) return matched;
    if (classId === MOCK_CURRENT_CLASS.id) {
      return MOCK_TOPICS;
    }
    return [];
  }
  return MOCK_TOPICS;
}

export function getMockTopicById(topicId: string): Topic | undefined {
  return MOCK_TOPICS.find((t) => t.id === topicId);
}

export function getMockMaterialsByTopicId(topicId: string): Material[] {
  return MOCK_MATERIALS.filter((m) => m.topicId === topicId);
}

export function getMockReferencesByTopicId(topicId: string): Reference[] {
  return MOCK_REFERENCES.filter((r) => r.topicId === topicId);
}

export function getMockAssignments(topicId?: string): Assignment[] {
  if (!topicId) return MOCK_ASSIGNMENTS;
  return MOCK_ASSIGNMENTS.filter((a) => a.topicId === topicId);
}

export function getMockAssignmentById(assignmentId: string): Assignment | undefined {
  return MOCK_ASSIGNMENTS.find((a) => a.id === assignmentId);
}

export function getMockQuizzes(topicId?: string): Quiz[] {
  if (!topicId) return MOCK_QUIZZES;
  return MOCK_QUIZZES.filter((q) => q.publications?.some((p) => p.topicId === topicId));
}

export function getMockQuizById(quizId: string): Quiz | undefined {
  return MOCK_QUIZZES.find((q) => q.id === quizId);
}

export function getMockForums(): Forum[] {
  return MOCK_FORUMS;
}

export function getMockForumById(forumId: string): Forum | undefined {
  return MOCK_FORUMS.find((f) => f.id === forumId);
}

export function getMockGrades(): StudentGradeSummary[] {
  return MOCK_STUDENT_GRADES;
}

export function getMockMembers(): ClassMemberItem[] {
  return MOCK_MEMBERS;
}
