import { Role } from '@/types/enum';
import z from 'zod';

const PasswordSchema = z
  .string()
  .min(8, { message: 'Ít nhất 8 kí tự.' })
  .regex(/[A-Z]/, { message: 'Chứa ít nhất 1 chữ in hoa.' })
  .regex(/[0-9]/, { message: 'Chứa ít nhất 1 kí tự số.' })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Chứa ít nhất 1 kí tự đặc biệt.',
  })
  .trim();

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Vui lòng nhập email hợp lệ.',
    })
    .trim(),
  password: PasswordSchema,
});

export const GoogleRegisterSchema = z
  .object({
    role: z.enum(Role),
    fullName: z.string().min(2, {
      message: 'Họ tên phải có ít nhất 2 kí tự.',
    }),
    schoolId: z.string().min(1, 'Vui lòng chọn trường.'),
    identityCode: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === 'student') {
        return !!data.identityCode && data.identityCode.length > 0;
      }

      return true;
    },
    {
      message: 'Mã số sinh viên là bắt buộc đối với sinh viên.',
      path: ['identityCode'],
    },
  );

export type GoogleProfileFormValues = z.infer<typeof GoogleRegisterSchema>;

export const RegisterSchema = z
  .object({
    role: z.enum(Role),
    fullName: z.string().min(2, {
      message: 'Họ tên phải có ít nhất 2 kí tự.',
    }),
    email: z
      .string()
      .email({
        message: 'Vui lòng nhập email hợp lệ.',
      })
      .trim(),
    password: PasswordSchema,
    confirmPassword: z.string(),
    schoolId: z.string().min(1, 'Vui lòng chọn trường.'),
    identityCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // check confirm password
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Mật khẩu không khớp.',
        path: ['confirmPassword'],
      });
    }

    // student bắt buộc identityCode
    if (data.role === 'student' && !data.identityCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Mã số sinh viên là bắt buộc đối với sinh viên.',
        path: ['identityCode'],
      });
    }
  });

export type RegisterFormValues = z.infer<typeof RegisterSchema>;
