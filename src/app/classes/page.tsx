// 'use client';

// import { ClassCard } from '@/features/classes/components/class-card';
// import { JoinConfirmModal } from '@/features/classes/components/modals/join-confirm-modal';
// import { SearchBar } from '@/components/common/search-bar';
// import { Class, ClassClient } from '@/types/class';
// import { Search, Users, Clock, BookOpen, Star } from 'lucide-react';
// import { useEffect, useMemo, useState } from 'react';
// import { Enrollment } from '@/types/enrollment';
// import { getAllClasses } from '@/services/class/class.service';
// import { getMyEnrollments } from '@/services/enrollment/enrollment.service';
// import { FindClassModal } from '@/features/classes/components/modals/find-class-modal';
// import { CreateClassModal } from '@/features/classes/components/modals/create-class-modal';
// import Link from 'next/link';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { toast } from 'sonner';
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from '@/components/ui/pagination';
// import { useCurrentUser } from '@/hooks/useCurrentUser';

// type ActiveTabs = 'find' | 'joined' | 'pending' | 'created';
// const ITEMS_PER_PAGE = 6;

// export default function Classes() {
//   const { user } = useCurrentUser();
//   // Data
//   const [allClasses, setAllClasses] = useState<Class[]>([]);
//   const [myEnrollments, setMyEnrollments] = useState<Enrollment[]>([]);
//   const [loading, setLoading] = useState(true);
//   // SEO
//   const [searchQuery, setSearchQuery] = useState('');
//   const starredClasses: Class[] = [];
//   // List
//   const [activeTab, setActiveTab] = useState<ActiveTabs>('joined');
//   const [currentPage, setCurrentPage] = useState(1);
//   // Modals
//   const [isJoinConfirmOpen, setIsJoinConfirmOpen] = useState(false);
//   const [selectedClassForJoin, setSelectedClassForJoin] = useState<Class | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       try {
//         const [classesRes, enrollmentsRes] = await Promise.all([
//           getAllClasses(),
//           getMyEnrollments(),
//         ]);

//         setAllClasses(classesRes.data);
//         setMyEnrollments(enrollmentsRes.data);
//       } catch (err) {
//         console.error('Fetch classes error:', err);
//         toast.error('Không thể tải danh sách lớp học');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const classesFromEnrollments: ClassClient[] = useMemo(() => {
//     return myEnrollments.map((e) => ({
//       ...e.class,
//       schoolName: e.class.school.name,
//       teacherName: e.class.teacher.fullName,
//       status: e.status === 'approved' ? 'joined' : e.status === 'pending' ? 'pending' : 'joined',
//       isOwner: e.roleIn === 'teacher',
//     }));
//   }, [myEnrollments]);

//   const mergedClasses: ClassClient[] = useMemo(() => {
//     const map = new Map();

//     // từ enrollments
//     classesFromEnrollments.forEach((c) => {
//       map.set(c.id, c);
//     });

//     // từ all classes (discover)
//     allClasses.forEach((c) => {
//       if (!map.has(c.id)) {
//         map.set(c.id, {
//           ...c,
//           schoolName: c.school?.name,
//           teacherName: c.teacher?.fullName,
//           status: 'find',
//           isOwner: false,
//         });
//       }
//     });

//     return Array.from(map.values());
//   }, [classesFromEnrollments, allClasses]);

//   // Filter classes by tab and search
//   const filteredClasses = useMemo(() => {
//     let list = mergedClasses;

//     // Filter by Tab
//     switch (activeTab) {
//       case 'find':
//         list = list.filter((c) => c.status === 'find');
//         break;
//       case 'joined':
//         list = list.filter((c) => c.status === 'joined');
//         break;
//       case 'pending':
//         list = list.filter((c) => c.status === 'pending');
//         break;
//       case 'created':
//         list = list.filter((c) => c.isOwner);
//         break;
//     }

//     // Filter by query
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       list = list.filter(
//         (c) =>
//           c.title.toLowerCase().includes(query) ||
//           c.subject.toLowerCase().includes(query) ||
//           c.teacherName.toLowerCase().includes(query),
//       );
//     }

//     return list;
//   }, [activeTab, searchQuery, mergedClasses]);

//   // Pagination Page
//   const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);
//   const paginatedClasses = filteredClasses.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE,
//   );

//   const handleTabChange = (tab: typeof activeTab) => {
//     setActiveTab(tab);
//     setCurrentPage(1);
//   };

//   const handleJoinClass = (classItem: Class) => {
//     setSelectedClassForJoin(classItem);
//     setIsJoinConfirmOpen(true);
//   };

//   const confirmJoin = async () => {
//     if (selectedClassForJoin) {
//       try {
//         // await apiService.post(`/classes/${selectedClassForJoin.id}/join`);
//         setAllClasses((prev) =>
//           prev.map((c) => (c.id === selectedClassForJoin.id ? { ...c, status: 'pending' } : c)),
//         );
//         toast.success('Đã gửi yêu cầu tham gia lớp học');
//       } catch (error) {
//         console.error(error);
//         toast.error('Không thể tham gia lớp học');
//       } finally {
//         setIsJoinConfirmOpen(false);
//         setSelectedClassForJoin(null);
//       }
//     }
//   };

//   const handleCreateClass = async (data: Class) => {
//     try {
//       // const newClass = await apiService.post<Class>('/classes', data);
//       // setAllClasses(prev => [newClass, ...prev]);
//       toast.success('Đã tạo lớp học mới');
//     } catch (error) {
//       console.error(error);
//       toast.error('Không thể tạo lớp học');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/50 pb-20">
//       {/* Header Section */}
//       <div className="bg-white border-b border-gray-100 pt-10 pb-6">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Danh sách lớp học</h1>
//               <p className="text-gray-500 mt-1">
//                 Trường: <span className="font-bold text-galaxy-blue">{user?.school.name}</span>
//                 {' - '}
//                 <span className="font-semibold text-galaxy-blue">{user?.school.shortname}</span>
//               </p>
//               <p className="text-gray-500 mt-1 text-sm">
//                 Address:{' '}
//                 <span className="font-bold text-galaxy-blue/70">{user?.school.address}</span>
//               </p>
//             </div>

//             <div className="flex items-center gap-3">
//               <SearchBar
//                 value={searchQuery}
//                 onChange={setSearchQuery}
//                 placeholder="Tìm lớp theo tên, môn học, giảng viên..."
//               />

//               <FindClassModal onJoinClass={handleJoinClass} classes={mergedClasses} />

//               {user?.role === 'teacher' && <CreateClassModal onCreateClass={handleCreateClass} />}
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="flex items-center gap-1 mt-10 border-b border-gray-100">
//             <Tabs
//               value={activeTab}
//               defaultValue="joined"
//               className="w-full"
//               onValueChange={(v) => handleTabChange(v as ActiveTabs)}
//             >
//               <TabsList className="bg-transparent h-auto p-0 gap-2">
//                 <TabsTrigger
//                   value="find"
//                   className="data-[state=active]:text-galaxy-blue data-[state=active]:border-galaxy-blue flex items-center gap-2 px-6 py-3 text-sm font-bold"
//                 >
//                   <Search className="w-4 h-4 mr-2" /> Khám phá
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="joined"
//                   className="data-[state=active]:text-galaxy-blue data-[state=active]:border-galaxy-blue flex items-center gap-2 px-6 py-3 text-sm font-bold"
//                 >
//                   <Users className="w-4 h-4" /> Đã tham gia
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="pending"
//                   className="data-[state=active]:text-galaxy-blue data-[state=active]:border-galaxy-blue flex items-center gap-2 px-6 py-3 text-sm font-bold"
//                 >
//                   <Clock className="w-4 h-4" /> Chờ duyệt
//                 </TabsTrigger>
//                 {user?.role === 'teacher' && (
//                   <TabsTrigger
//                     value="created"
//                     className="data-[state=active]:text-galaxy-blue data-[state=active]:border-galaxy-blue flex items-center gap-2 px-6 py-3 text-sm font-bold"
//                   >
//                     <BookOpen className="w-4 h-4" /> Đã tạo
//                   </TabsTrigger>
//                 )}
//               </TabsList>
//             </Tabs>
//           </div>
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="container mx-auto px-4 py-10">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-1 space-y-6">
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-center gap-2 mb-4">
//                 <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
//                 <h3 className="font-bold text-gray-900">Lớp học đã lưu</h3>
//               </div>
//               <div className="space-y-3">
//                 {starredClasses.length > 0 ? (
//                   starredClasses.map((c) => (
//                     <Link key={c.id} href={`/classes/${c.id}`} className="block group">
//                       <div className="p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
//                         <p className="text-sm font-bold text-gray-900 group-hover:text-galaxy-blue transition-colors line-clamp-1">
//                           {c.title}
//                         </p>
//                         <p className="text-xs text-gray-500 mt-0.5">{c.courseCode}</p>
//                       </div>
//                     </Link>
//                   ))
//                 ) : (
//                   <p className="text-xs text-gray-400 italic">Chưa có lớp học nào được lưu.</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Main Grid */}
//           <div className="lg:col-span-3">
//             {paginatedClasses.length > 0 ? (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {paginatedClasses.map((classItem) => (
//                     <ClassCard
//                       key={classItem.id}
//                       classItem={classItem}
//                       actionLabel={activeTab === 'find' ? 'Tham gia lớp' : 'Vào lớp học'}
//                       onAction={(id) => {
//                         if (activeTab === 'find') {
//                           handleJoinClass(classItem);
//                         } else {
//                           window.location.href = `/classes/${id}`;
//                         }
//                       }}
//                     />
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <Pagination className="mt-12">
//                     <PaginationContent>
//                       <PaginationItem>
//                         <PaginationPrevious
//                           onClick={() => setCurrentPage((prev) => prev - 1)}
//                           className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
//                         />
//                       </PaginationItem>
//                       {Array.from({ length: totalPages }).map((_, idx) => (
//                         <PaginationItem key={idx}>
//                           <PaginationLink
//                             isActive={currentPage === idx + 1}
//                             onClick={() => setCurrentPage(idx + 1)}
//                           >
//                             {idx + 1}
//                           </PaginationLink>
//                         </PaginationItem>
//                       ))}
//                       <PaginationItem>
//                         <PaginationNext
//                           onClick={() => setCurrentPage((prev) => prev + 1)}
//                           className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
//                         />
//                       </PaginationItem>
//                     </PaginationContent>
//                   </Pagination>
//                   // <div className="flex items-center justify-center gap-2 mt-12">
//                   //   <Button
//                   //     variant="outline"
//                   //     size="icon"
//                   //     disabled={currentPage === 1}
//                   //     onClick={() => setCurrentPage(prev => prev - 1)}
//                   //     className="rounded-xl border-gray-200"
//                   //   >
//                   //     <ChevronLeft className="w-4 h-4" />
//                   //   </Button>

//                   //   {Array.from({ length: totalPages }).map((_, i) => (
//                   //     <Button
//                   //       key={i}
//                   //       variant={currentPage === i + 1 ? 'default' : 'outline'}
//                   //       onClick={() => setCurrentPage(i + 1)}
//                   //       className={cn(
//                   //         "w-10 h-10 rounded-xl font-bold",
//                   //         currentPage === i + 1 ? "bg-galaxy text-white" : "border-gray-200 text-gray-600"
//                   //       )}
//                   //     >
//                   //       {i + 1}
//                   //     </Button>
//                   //   ))}

//                   //   <Button
//                   //     variant="outline"
//                   //     size="icon"
//                   //     disabled={currentPage === totalPages}
//                   //     onClick={() => setCurrentPage(prev => prev + 1)}
//                   //     className="rounded-xl border-gray-200"
//                   //   >
//                   //     <ChevronRight className="w-4 h-4" />
//                   //   </Button>
//                   // </div>
//                 )}
//               </>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
//                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
//                   <Search className="w-10 h-10 text-gray-300" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900">Không tìm thấy lớp học nào</h3>
//                 <p className="text-gray-500 mt-2 max-w-xs">
//                   Thử thay đổi từ khóa tìm kiếm hoặc chuyển sang tab khác.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Join Confirmation Modal */}
//       <JoinConfirmModal
//         isOpen={isJoinConfirmOpen}
//         onOpenChange={setIsJoinConfirmOpen}
//         selectedClass={selectedClassForJoin}
//         onConfirm={confirmJoin}
//       />
//     </div>
//   );
// }
