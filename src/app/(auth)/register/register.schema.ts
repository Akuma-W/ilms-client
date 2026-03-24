import z from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
  .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số')
  .regex(/[^a-zA-Z0-9]/, 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt');

const registerSchema = z
  .object({
    role: z.enum(['student', 'teacher'] as const),
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: passwordSchema,
    confirmPassword: z.string(),
    schoolId: z.string().min(1, 'Vui lòng chọn trường'),
    identityCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.role === 'student') {
        return !!data.identityCode && data.identityCode.length > 0;
      }
      return true;
    },
    {
      message: 'Mã số sinh viên là bắt buộc đối với sinh viên',
      path: ['identityCode'],
    },
  );

type RegisterFormValues = z.infer<typeof registerSchema>;

export { type RegisterFormValues, registerSchema };
