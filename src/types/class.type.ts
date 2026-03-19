import { School } from "./school.type";
import { User } from "./user.type";

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
