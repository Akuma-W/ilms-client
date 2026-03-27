import { Button } from "@/components/ui/button";
import { ClassList } from "@/features/classes/components/class-list";
import { ClassSkeleton } from "@/features/classes/components/modals/class-skeleton";
import { LayoutDashboard, BookOpen, GraduationCap, Settings, LogOut, Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Danh sách lớp',
};

interface ClassesProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

export default function Classes({ searchParams }: ClassesProps) {
  const resolvedSearchParams = searchParams;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Technical Dashboard Style */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
        <nav className="flex-1 space-y-2">
          <Link href="/classes" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-galaxy-blue font-bold transition-all">
            <LayoutDashboard className="w-5 h-5" />
            <span>Tổng quan</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 p-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium transition-all">
            <BookOpen className="w-5 h-5" />
            <span>Khóa học</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 p-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium transition-all">
            <GraduationCap className="w-5 h-5" />
            <span>Điểm số</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 p-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium transition-all">
            <Settings className="w-5 h-5" />
            <span>Cài đặt</span>
          </Link>
        </nav>

        <div className="pt-6 border-t border-gray-50">
          <button className="flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-all w-full">
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full">
        <header className="flex items-center justify-between mb-12">
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-10 h-10 bg-galaxy rounded-xl flex items-center justify-center text-white font-bold text-xl">
              L
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button className="rounded-2xl bg-galaxy hover:opacity-90 transition-all shadow-lg shadow-blue-900/20 font-bold px-6 h-12">
              <Plus className="w-5 h-5 mr-2" />
              Tạo lớp học mới
            </Button>
            {/* <div className="w-12 h-12 rounded-2xl bg-gray-200 border-2 border-white shadow-sm overflow-hidden relative">
              <Image 
                src="https://picsum.photos/seed/user/100/100" 
                alt="User" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div> */}
          </div>
        </header>

        <Suspense fallback={<ClassSkeleton />}>
          <ClassList searchParams={resolvedSearchParams} />
        </Suspense>
      </main>
    </div>
  )
}
