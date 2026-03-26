'use client';

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { School } from "@/types/school";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleProfileFormValues, GoogleRegisterSchema } from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@/types/enum";
import { authService } from "../services/auth.service";

interface GoogleRegisterFormProps {
  schools: School[];
  defaultFullName?: string;
  email: string;
  onSuccess?: () => void;
}

export function GoogleRegisterForm({
  schools,
  defaultFullName,
  email,
  onSuccess,
}: GoogleRegisterFormProps) {
  const { mutateUser } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);

  const googleRegisterForm = useForm<GoogleProfileFormValues>({
    resolver: zodResolver(GoogleRegisterSchema),
    defaultValues: {
      role: 'student',
      fullName: defaultFullName || '',
      schoolId: '',
      identityCode: '',
    },
  });

  const selectedRole = googleRegisterForm.watch('role');

  async function onSubmit(values:GoogleProfileFormValues) {
    setIsLoading(true);

    try {
      await authService
    } catch (error) {
      
    }
  }
  return (
    <div>google-register-form</div>
  )
}
