import { Metadata } from 'next';
import { userServerService } from '@/features/user/services/user.server.service';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Calendar, Edit, Mail, School, BookOpen, Users, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ROLE_CONFIG } from '@/config';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Trang cá nhân',
};

interface ProfileProps {
  params: Promise<{ id: string }>;
}

export default async function Profile({ params }: ProfileProps) {
  const { id: userId } = await params;

  const [user, currentUser] = await Promise.all([
    userServerService.getUser(userId),
    userServerService.getMe(),
  ]);

  if (!user) {
    redirect('/404');
  }

  const role = ROLE_CONFIG[user.role];
  const isCurrentUser = currentUser?.id === user.id;

  return (
    <div className="min-h-screen bg-gray-50/50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <Card className="overflow-hidden border-none shadow-xl shadow-gray-200/50 rounded-[2.5rem] mb-8">
          <div className="h-48 bg-linear-to-r from-galaxy-blue to-galaxy-purple relative">
            <div className="absolute -bottom-16 left-8 md:left-12">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl">
                <Avatar className="w-full h-full rounded-[2rem] overflow-hidden relative bg-gray-100">
                  <AvatarImage src={user.avatar || undefined} alt={user.fullName} />
                  <AvatarFallback className="bg-galaxy text-white text-2xl rounded-[2rem]">
                    {user.fullName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          <CardContent className="pt-20 pb-10 px-8 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {user.fullName}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-500">
                  <div className={`flex items-center gap-1.5 ${role.className}`}>
                    <Shield className="w-4 h-4" />
                    {role.label}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              {isCurrentUser && (
                <Button className="rounded-2xl bg-galaxy-blue hover:bg-blue-600 font-bold px-6">
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            <Card className="rounded-[2rem] border-none shadow-lg shadow-gray-100">
              <CardHeader>
                <CardTitle className="text-xl">Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Mail className="w-5 h-5 text-galaxy-blue" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <School className="w-5 h-5 text-galaxy-purple" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Trường học
                    </p>
                    <p className="text-gray-900 font-medium">
                      {user.school?.name || 'Đại học Bách Khoa'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border-none shadow-lg shadow-gray-100">
              <CardHeader>
                <CardTitle className="text-xl">Thống kê</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl text-center">
                  <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-500 font-medium">Khóa học</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl text-center">
                  <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">45</p>
                  <p className="text-xs text-gray-500 font-medium">Bạn bè</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[2rem] border-none shadow-lg shadow-gray-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Lớp học nổi bật</CardTitle>
                <Button variant="ghost" className="text-galaxy-blue font-bold">
                  Xem tất cả
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors group cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden relative">
                      <Image
                        src={`https://picsum.photos/seed/class${i}/100/100`}
                        alt="Class"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 group-hover:text-galaxy-blue transition-colors">
                        Giải tích 1 - Nhóm {i}
                      </h4>
                      <p className="text-sm text-gray-500">Giảng viên: TS. Nguyễn Văn B</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold">4.8</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
