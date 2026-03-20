import { ClassCard } from "@/components/classes/class-card";
import { JoinConfirmModal } from "@/components/modals/join-confirm-modal";
import { SearchBar } from "@/components/common/search-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { Class } from "@/types/class.type";
import { Search, Users, Clock, BookOpen, Star, Link, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type ActiveTabs = 'find' | 'joined' | 'pending' | 'created';

export default function Classes() {
  const { user } = useAuth();

  // SEO
  const [searchQuery, setSearchQuery] = useState('');
  // List
  const [activeTab, setActiveTab] = useState<ActiveTabs>('joined');
  const [currentPage, setCurrentPage] = useState(1);
  // Modals
  const [isJoinConfirmOpen, setIsJoinConfirmOpen] = useState(false);
  const [selectedClassForJoin, setSelectedClassForJoin] = useState<Class | null>(null);

  // Filler classes by tab and search
  const filteredClasses = useMemo(() => {
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 pt-10 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Danh sách lớp học</h1>
              <p className="text-gray-500 mt-1">Trường: <span className="font-bold text-galaxy-blue">{user?.school || 'Đại học Bách Khoa'}</span></p>
            </div>
            
            <div className="flex items-center gap-3">
              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery} 
                placeholder="Tìm lớp theo tên, môn học, mã..." 
              />

              <FindClassModal 
                onJoinClass={handleJoinClass} 
                mockClasses={MOCK_CLASSES} 
              />

              {user?.role === 'teacher' && (
                <CreateClassModal onCreateClass={(data) => console.log('Create class:', data)} />
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-10 border-b border-gray-100">
            <TabButton 
              active={activeTab === 'find'} 
              onClick={() => handleTabChange('find')}
              icon={<Search className="w-4 h-4" />}
              label="Khám phá"
            />
            <TabButton 
              active={activeTab === 'joined'} 
              onClick={() => handleTabChange('joined')}
              icon={<Users className="w-4 h-4" />}
              label="Đã tham gia"
            />
            <TabButton 
              active={activeTab === 'pending'} 
              onClick={() => handleTabChange('pending')}
              icon={<Clock className="w-4 h-4" />}
              label="Chờ duyệt"
            />
            {user?.role === 'teacher' && (
              <TabButton 
                active={activeTab === 'created'} 
                onClick={() => handleTabChange('created')}
                icon={<BookOpen className="w-4 h-4" />}
                label="Đã tạo"
              />
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <h3 className="font-bold text-gray-900">Lớp học đã lưu</h3>
              </div>
              <div className="space-y-3">
                {starredClasses.length > 0 ? (
                  starredClasses.map(c => (
                    <Link key={c.id} href={`/class/${c.id}`} className="block group">
                      <div className="p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-galaxy-blue transition-colors line-clamp-1">{c.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{c.code}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">Chưa có lớp học nào được lưu.</p>
                )}
              </div>
            </div>

            <div className="bg-galaxy/5 rounded-2xl p-6 border border-galaxy/10">
              <h3 className="font-bold text-galaxy-blue mb-2">Mẹo nhỏ</h3>
              <p className="text-xs text-galaxy-blue/70 leading-relaxed">
                Bạn có thể tìm kiếm lớp học nhanh chóng bằng mã lớp 6 ký tự. Đừng quên đánh dấu sao các lớp quan trọng để truy cập nhanh từ thanh bên này.
              </p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="lg:col-span-3">
            {paginatedClasses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedClasses.map((classItem) => (
                    <ClassCard 
                      key={classItem.id} 
                      classItem={classItem} 
                      actionLabel={activeTab === 'find' ? 'Tham gia lớp' : 'Vào lớp học'}
                      onAction={(id) => {
                        if (activeTab === 'find') {
                          handleJoinClass(classItem);
                        } else {
                          window.location.href = `/class/${id}`;
                        }
                      }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button 
                      variant="outline" 
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="rounded-xl border-gray-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(i + 1)}
                        className={cn(
                          "w-10 h-10 rounded-xl font-bold",
                          currentPage === i + 1 ? "bg-galaxy text-white" : "border-gray-200 text-gray-600"
                        )}
                      >
                        {i + 1}
                      </Button>
                    ))}

                    <Button 
                      variant="outline" 
                      size="icon"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="rounded-xl border-gray-200"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Không tìm thấy lớp học nào</h3>
                <p className="text-gray-500 mt-2 max-w-xs">Thử thay đổi từ khóa tìm kiếm hoặc chuyển sang tab khác.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Join Confirmation Modal */}
      <JoinConfirmModal 
        isOpen={isJoinConfirmOpen}
        onOpenChange={setIsJoinConfirmOpen}
        selectedClass={selectedClassForJoin}
        onConfirm={confirmJoin}
      />
    </div>
  )
}
