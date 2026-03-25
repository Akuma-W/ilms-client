import { API_URL } from '@/config';
import { LoginFormSchema } from '../schemas/auth.schema';
import { redirect } from 'next/navigation';
import { FormState } from '@/types/action';
import { AUTH_ERROR_MAP } from '../errors/auth.errors';

export type LoginState = FormState<
  { email?: string },
  {
    email?: string[],
    password?: string[],
  }
>;

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Dữ liệu không hợp lệ.',
      data: {
        email: formData.get('email') as string,
      },
    };
  }

  // Call Login API
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(validatedFields.data),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const result = await res.json();

  // Handle error
  if (!res.ok || !result.success) {
    return {
      message: AUTH_ERROR_MAP[result.message] || 'Đăng nhập thất bại',
      data: {
        email: formData.get('email') as string,
      },
    };
  }

  // Redirect
  redirect('/classes');
}
