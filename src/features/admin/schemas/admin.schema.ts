import { z } from 'zod';

export const schoolFormSchema = z.object({
  name: z.string().min(2, 'Tên trường học phải có ít nhất 2 ký tự').trim(),
  shortname: z
    .string()
    .min(2, 'Mã viết tắt phải có ít nhất 2 ký tự')
    .max(20, 'Mã viết tắt tối đa 20 ký tự')
    .toUpperCase()
    .trim(),
  address: z.string().optional(),
  city: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export type SchoolFormValues = z.infer<typeof schoolFormSchema>;

export const classFormSchema = z.object({
  name: z.string().min(3, 'Tên lớp học phải có ít nhất 3 ký tự').trim(),
  code: z.string().optional(),
  schoolId: z.string().min(1, 'Vui lòng chọn trường học'),
  subjectId: z.string().min(1, 'Vui lòng chọn môn học'),
  teacherId: z.string().min(1, 'Vui lòng chọn giảng viên phụ trách'),
  maxStudents: z.number().min(1, 'Sĩ số tối thiểu là 1').max(500, 'Sĩ số tối đa là 500'),
  isPrivate: z.boolean(),
});

export type ClassFormValues = z.infer<typeof classFormSchema>;

export const userFormSchema = z.object({
  email: z.string().email('Địa chỉ email không hợp lệ').trim(),
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự').trim(),
  identityCode: z.string().optional(),
  role: z.enum(['admin', 'teacher', 'student']),
  schoolId: z.string().min(1, 'Vui lòng chọn trường học'),
  status: z.enum(['active', 'locked', 'banned']).optional(),
  password: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const quizTakedownSchema = z.object({
  reason: z
    .string()
    .min(5, 'Vui lòng nhập lý do kiểm duyệt bản quyền chi tiết (tối thiểu 5 ký tự)')
    .trim(),
});

export type QuizTakedownValues = z.infer<typeof quizTakedownSchema>;
