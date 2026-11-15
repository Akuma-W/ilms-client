import { CLIENT_API_URL } from '@/config';
import { clientApiClient } from '@/lib/api/client-api-client';
import { PromiseResponse } from '@/types/api';
import { GoogleRegisterDto, GoogleUser, RegisterDto } from '@/types/auth';

export const authService = {
  // Initiates user registration and triggers email OTP
  async register(data: RegisterDto): PromiseResponse<null> {
    const result = await clientApiClient<null>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.success === false) {
      throw new Error(result.message);
    }

    return result;
  },

  // Verifies email OTP and finalizes user account creation
  async verifyRegistrationOtp(data: {
    email: string;
    otp: string;
  }): PromiseResponse<{ id: string; email: string }> {
    const result = await clientApiClient<{ id: string; email: string }>(
      '/auth/register/verify-otp',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    );

    if (result.success === false) {
      throw new Error(result.message);
    }

    return result;
  },

  // Resends registration OTP code
  async resendRegistrationOtp(email: string): PromiseResponse<null> {
    const result = await clientApiClient<null>('/auth/register/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (result.success === false) {
      throw new Error(result.message);
    }

    return result;
  },

  // Requests forgot password OTP code via email
  async forgotPassword(email: string): PromiseResponse<null> {
    const result = await clientApiClient<null>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (result.success === false) {
      throw new Error(result.message);
    }

    return result;
  },

  // Verifies forgot password OTP code before setting new password
  async verifyForgotPasswordOtp(data: {
    email: string;
    otp: string;
  }): PromiseResponse<null> {
    const result = await clientApiClient<null>('/auth/forgot-password/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.success === false) {
      throw new Error(result.message);
    }

    return result;
  },

  // Verifies reset OTP and sets new password
  async resetPassword(data: {
    email: string;
    otp: string;
    password?: string;
    newPassword?: string;
  }): PromiseResponse<null> {
    const payload = {
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword || data.password,
    };

    const result = await clientApiClient<null>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (result.success === false) {
      throw new Error(result.message);
    }

    return result;
  },

  // Changes password for currently authenticated user
  async changePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): PromiseResponse<null> {
    const result = await clientApiClient<null>('/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (result.success === false) {
      throw new Error(result.message);
    }

    return result;
  },

  // Triggers Google OAuth authentication
  googleLogin(): void {
    window.location.href = `${CLIENT_API_URL}/auth/google`;
  },

  // Retrieves current Google user onboarding info
  async getGoogleUser(): Promise<GoogleUser | null> {
    const { data } = await clientApiClient<GoogleUser>('/auth/google/me');
    return data;
  },

  // Finalizes Google onboarding registration
  async googleRegister(data: GoogleRegisterDto): PromiseResponse<{
    userId: string;
  }> {
    return clientApiClient<{ userId: string }>('/auth/google/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Logs out user and destroys session
  async logout(): Promise<string> {
    const { message } = await clientApiClient<null>('/auth/logout', {
      method: 'POST',
    });

    return message;
  },
};
