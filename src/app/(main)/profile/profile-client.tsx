'use client';

import type { User } from '@/types/user';
import { useCurrentUser } from '@/features/user/hooks/use-current-user';
import { ProfileHeader } from '@/features/user/components/profile-header';
import { ProfileInfoCard } from '@/features/user/components/profile-info-card';
import { ChangePasswordCard } from '@/features/user/components/change-password-card';
import { LearningProgressTab } from '@/features/user/components/learning-progress-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, BookOpen, KeyRound, Loader2, User as UserIcon } from 'lucide-react';

interface ProfileClientProps {
  initialUser: User;
}

export function ProfileClient({ initialUser }: ProfileClientProps) {
  const { user, isLoading, mutateUser } = useCurrentUser({
    initialUser,
  });

  const currentUser = user || initialUser;
  const isStudent = currentUser.role === 'student';

  if (isLoading && !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-slate-500 text-xs sm:text-sm">Đang tải thông tin hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Persistent Profile Header: Avatar, Name, Email, Role, School, Joined Date */}
        <ProfileHeader user={currentUser} mutateUser={mutateUser} />

        {/* Tab Navigation Hub in requested order: 1. Thông tin cá nhân, 2. Tiến độ / Quản lý lớp, 3. Cài đặt */}
        <Tabs defaultValue="info" className="w-full space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-2xl shadow-xs inline-flex h-auto">
            {/* TAB 1: Thông tin cá nhân */}
            <TabsTrigger
              value="info"
              className="gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all"
            >
              <UserIcon className="size-4" />
              <span>Thông tin cá nhân</span>
            </TabsTrigger>

            {/* TAB 2: Tiến độ học tập / Quản lý lớp học */}
            <TabsTrigger
              value="classes"
              className="gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all"
            >
              {isStudent ? <Award className="size-4" /> : <BookOpen className="size-4" />}
              <span>{isStudent ? 'Tiến độ học tập' : 'Quản lý lớp học'}</span>
            </TabsTrigger>

            {/* TAB 3: Cài đặt */}
            <TabsTrigger
              value="settings"
              className="gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all"
            >
              <KeyRound className="size-4" />
              <span>Cài đặt</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: PROFILE INFORMATION */}
          <TabsContent value="info" className="space-y-4 focus-visible:outline-hidden">
            <ProfileInfoCard user={currentUser} mutateUser={mutateUser} />
          </TabsContent>

          {/* TAB 2: LEARNING PROGRESS / CLASS MANAGEMENT */}
          <TabsContent value="classes" className="space-y-4 focus-visible:outline-hidden">
            <LearningProgressTab user={currentUser} />
          </TabsContent>

          {/* TAB 3: SETTINGS (PASSWORD SECURITY) */}
          <TabsContent value="settings" className="space-y-4 focus-visible:outline-hidden">
            <ChangePasswordCard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
