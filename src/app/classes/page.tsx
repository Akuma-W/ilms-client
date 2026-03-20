'use client';

import { ClassCard } from "@/components/classes/class-card";
import { JoinConfirmModal } from "@/components/modals/join-confirm-modal";
import { SearchBar } from "@/components/common/search-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { Class, ClassClient } from "@/types/class.type";
import { Search, Users, Clock, BookOpen, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Enrollment } from "@/types/enrollment.type";
import { getAllClasses } from "@/services/class/class.service";
import { getMyEnrollments } from "@/services/enrollment/enrollment.service";
import { FindClassModal } from "@/components/modals/find-class-modal";
import { CreateClassModal } from "@/components/modals/create-class-modal";
import Link from "next/link";

type ActiveTabs = 'find' | 'joined' | 'pending' | 'created';
const ITEMS_PER_PAGE = 6;

export default function Classes() {
  const { user } = useAuth();
  // Data
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  // SEO
  const [searchQuery, setSearchQuery] = useState('');
  const starredClasses: Class[] = [];
  // List
  const [activeTab, setActiveTab] = useState<ActiveTabs>('joined');
  const [currentPage, setCurrentPage] = useState(1);
  // Modals
  const [isJoinConfirmOpen, setIsJoinConfirmOpen] = useState(false);
  const [selectedClassForJoin, setSelectedClassForJoin] = useState<Class | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [classesRes, enrollmentsRes] = await Promise.all([
          getAllClasses(),
          getMyEnrollments(),
        ]);

        setAllClasses(classesRes.data);
        setMyEnrollments(enrollmentsRes.data);
      } catch (err) {
        console.error('Fetch classes error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const classesFromEnrollments: ClassClient[] = useMemo(() => {
    return myEnrollments.map((e) => ({
      ...e.class,
      schoolName: e.class.school.name,
      teacherName: e.class.teacher.fullName,
      status:
        e.status === 'approved'
          ? 'joined'
          : e.status === 'pending'
          ? 'pending'
          : 'joined',
      isOwner: e.roleIn === 'teacher',
    }));
  }, [myEnrollments]);

  const mergedClasses: ClassClient[] = useMemo(() => {
    const map = new Map();

    // từ enrollments
    classesFromEnrollments.forEach((c) => {
      map.set(c.id, c);
    });

    // từ all classes (discover)
    allClasses.forEach((c) => {
      if (!map.has(c.id)) {
        map.set(c.id, {
          ...c,
          schoolName: c.school?.name,
          teacherName: c.teacher?.fullName,
          status: 'find',
          isOwner: false,
        });
      }
    });

    return Array.from(map.values());
  }, [classesFromEnrollments, allClasses]);

  // Filter classes by tab and search
  const filteredClasses = useMemo(() => {
    let list = mergedClasses;

    // Filter by Tab
    switch (activeTab) {
      case 'find':
        list = list.filter((c) => c.status === 'find');
        break;
      case 'joined':
        list = list.filter((c) => c.status === 'joined');
        break;
      case 'pending':
        list = list.filter((c) => c.status === 'pending');
        break;
      case 'created':
        list = list.filter((c) => c.isOwner);
        break;
    }

    // Filter by query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter(c => 
        c.title.toLowerCase().includes(query) || 
        c.subject.toLowerCase().includes(query) ||
        c.teacherName.toLowerCase().includes(query)
      );
    }

    return list;
  }, [activeTab, searchQuery, mergedClasses]);

  // Pagination Page
  const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleJoinClass = (classItem: Class) => {
    setSelectedClassForJoin(classItem);
    setIsJoinConfirmOpen(true);
  };

  const confirmJoin = () => {
    if (selectedClassForJoin) {
      console.log('Joining class:', selectedClassForJoin.id);
      // In a real app, update the status to 'pending'
      setIsJoinConfirmOpen(false);
      setSelectedClassForJoin(null);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading classes...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 pt-10 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Danh sách lớp học</h1>
              <p className="text-gray-500 mt-1">Trường: <span className="font-bold text-galaxy-blue">{user?.school.name}</span></p>
            </div>
            
            <div className="flex items-center gap-3">
              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery} 
                placeholder="Tìm lớp theo tên, môn học, mã..." 
              />

              <FindClassModal
                onJoinClass={handleJoinClass}
                classes={mergedClasses}
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
                    <Link key={c.id} href={`/classes/${c.id}`} className="block group">
                      <div className="p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-galaxy-blue transition-colors line-clamp-1">{c.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{c.courseCode}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">Chưa có lớp học nào được lưu.</p>
                )}
              </div>
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
                          window.location.href = `/classes/${id}`;
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
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 relative",
      active 
        ? "text-galaxy-blue border-galaxy-blue" 
        : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
    )}
  >
    {icon}
    {label}
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-galaxy-blue animate-in fade-in duration-300" />
    )}
  </button>
);
