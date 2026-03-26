import { School } from './school';
import { User } from './user';

// type ClassStatus = {
//   find: "find",
//   joined: "joined",
//   pending: "pending",
//   created: "created",
// }

export interface Class {
  id: string;
  title: string;
  subject: string;
  description: string | null;
  courseCode: string;
  semester: string | null;
  isPrivate: boolean;
  schoolId: string;
  teacherId: string;
  createdAt: Date;

  school: School;
  teacher: User;
}

export interface ClassClient extends Class {
  schoolName: string;
  teacherName: string;
  status: string;
  isOwner: boolean;
}
