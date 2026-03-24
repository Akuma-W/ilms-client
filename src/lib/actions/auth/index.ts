import { authService } from "@/services/auth/auth.service";
import { LoginFormSchema } from "./auth.zod";
import { redirect } from "next/navigation";

export type FormState = 
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message: string;
    }
  | undefined;

export async function loginAction(state: FormState, formData: FormData): Promise<FormState> {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Login.',
    }
  }

  // Call Auth Service
  const res = await authService.login(validatedFields.data);

  if (!res.success) {
    return {
      message: res.message || 'Đăng nhập thất bại',
    };
  }

  // Redirect
  redirect('/classes');
}
