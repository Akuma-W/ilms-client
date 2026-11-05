// 'use client';

// import { useState } from 'react';
// import useSWR from 'swr';
// import { motion, AnimatePresence } from 'motion/react';
// import {
//   BookOpen,
//   ChevronDown,
//   ChevronUp,
//   FileText,
//   FolderOpen,
//   Link as LinkIcon,
//   Play,
//   Presentation,
//   Trash2,
//   Paperclip,
//   Clock,
//   Sparkles,
//   ExternalLink,
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { CreateTopicModal } from '@/features/classes/components/modals/create-topic-modal';
// import { CreateMaterialModal } from '@/features/classes/components/modals/create-material-modal';
// import { topicsService } from '@/features/classes/services/topics.service';
// import { materialsService } from '@/features/classes/services/materials.service';
// import { Topic, Material } from '@/types';

// interface OverviewClientProps {
//   classId: string;
//   initialTopics: (Topic & { materials?: Material[] })[];
//   isTeacher: boolean;
// }

// export function OverviewClient({ classId, initialTopics, isTeacher }: OverviewClientProps) {
//   const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
//   const [activeTopicForMaterial, setActiveTopicForMaterial] = useState<string | null>(null);

//   // Fetch topics and materials with SWR for reactive updates
//   const { data: topics, mutate } = useSWR(
//     `classes/${classId}/overview-data`,
//     async () => {
//       const fetchedTopics = await topicsService.getTopics(classId);
//       const withMaterials = await Promise.all(
//         fetchedTopics.map(async (topic) => {
//           const materials = await materialsService.getMaterials(topic.id);
//           return { ...topic, materials };
//         })
//       );
//       return withMaterials;
//     },
//     {
//       fallbackData: initialTopics,
//       revalidateOnFocus: false,
//     }
//   );

//   const toggleExpand = (topicId: string) => {
//     setExpandedTopics((prev) => ({
//       ...prev,
//       [topicId]: !prev[topicId],
//     }));
//   };

//   const handleDeleteTopic = async (topicId: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (!confirm('Bạn có chắc chắn muốn xóa bài giảng này cùng với toàn bộ tài liệu bên trong không?')) {
//       return;
//     }

//     try {
//       const res = await topicsService.deleteTopic(topicId);
//       if (!res.success) throw new Error(res.message);
//       toast.success('Xóa bài giảng thành công!');
//       mutate();
//     } catch (error) {
//       toast.error('Xóa bài giảng thất bại', {
//         description: error instanceof Error ? error.message : 'Vui lòng thử lại.',
//       });
//     }
//   };

//   const handleDeleteMaterial = async (materialId: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) {
//       return;
//     }

//     try {
//       const res = await materialsService.deleteMaterial(materialId);
//       if (!res.success) throw new Error(res.message);
//       toast.success('Xóa tài liệu thành công!');
//       mutate();
//     } catch (error) {
//       toast.error('Xóa tài liệu thất bại', {
//         description: error instanceof Error ? error.message : 'Vui lòng thử lại.',
//       });
//     }
//   };

//   const getMaterialIcon = (type: string) => {
//     switch (type) {
//       case 'video':
//         return <Play className="h-5 w-5 text-blue-500 shrink-0" />;
//       case 'pdf':
//         return <FileText className="h-5 w-5 text-red-500 shrink-0" />;
//       case 'slide':
//         return <Presentation className="h-5 w-5 text-orange-500 shrink-0" />;
//       case 'document':
//         return <FileText className="h-5 w-5 text-emerald-500 shrink-0" />;
//       default:
//         return <LinkIcon className="h-5 w-5 text-purple-500 shrink-0" />;
//     }
//   };

//   const getMaterialBadge = (type: string) => {
//     const base = "text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider";
//     switch (type) {
//       case 'video':
//         return <span className={`${base} bg-blue-50 text-blue-600 border border-blue-200`}>Video</span>;
//       case 'pdf':
//         return <span className={`${base} bg-red-50 text-red-600 border border-red-200`}>PDF</span>;
//       case 'slide':
//         return <span className={`${base} bg-orange-50 text-orange-600 border border-orange-200`}>Slide</span>;
//       case 'document':
//         return <span className={`${base} bg-emerald-50 text-emerald-600 border border-emerald-200`}>Doc</span>;
//       default:
//         return <span className={`${base} bg-purple-50 text-purple-600 border border-purple-200`}>Link</span>;
//     }
//   };

//   // Stats calculation
//   const totalMaterials = topics?.reduce((acc, t) => acc + (t.materials?.length || 0), 0) || 0;

//   return (
//     <div className="container mx-auto lg:max-w-7xl pb-16">
//       {/* Header bar */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <BookOpen className="h-6 w-6 text-galaxy-blue" />
//             Nội dung bài học
//           </h2>
//           <p className="text-gray-500 text-sm mt-0.5">
//             Danh sách các chương học, chuyên đề bài học và tài liệu đi kèm của lớp
//           </p>
//         </div>
//         {isTeacher && (
//           <CreateTopicModal classId={classId} onSuccess={() => mutate()} />
//         )}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//         {/* Main Content: Topics list */}
//         <div className="lg:col-span-3 space-y-4">
//           {(!topics || topics.length === 0) ? (
//             <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-sm flex flex-col items-center">
//               <FolderOpen className="h-16 w-16 text-gray-300 mb-4" />
//               <h3 className="text-lg font-bold text-gray-700">Chưa có bài giảng nào</h3>
//               <p className="text-gray-400 text-sm max-w-sm mt-2">
//                 {isTeacher
//                   ? 'Hãy bắt đầu thiết lập bài học đầu tiên bằng cách nhấn nút "Thêm bài giảng mới" ở trên.'
//                   : 'Giảng viên chưa tải lên nội dung bài học cho lớp này.'}
//               </p>
//               {isTeacher && (
//                 <div className="mt-6">
//                   <CreateTopicModal classId={classId} onSuccess={() => mutate()} />
//                 </div>
//               )}
//             </div>
//           ) : (
//             topics.map((topic, index) => {
//               const isExpanded = expandedTopics[topic.id] !== false; // Default expanded
//               const materials = topic.materials || [];

//               return (
//                 <motion.div
//                   key={topic.id}
//                   layout
//                   initial={{ opacity: 0, y: 12 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.05 }}
//                   className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden group/topic hover:shadow-md hover:border-gray-200/80 transition-all duration-300"
//                 >
//                   {/* Topic Header */}
//                   <div
//                     onClick={() => toggleExpand(topic.id)}
//                     className="p-5 flex justify-between items-center cursor-pointer select-none bg-linear-to-r from-white via-white to-gray-50/30"
//                   >
//                     <div className="flex items-start gap-4">
//                       <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-bold text-galaxy-blue mt-0.5 shrink-0">
//                         {index + 1}
//                       </div>
//                       <div>
//                         <h3 className="font-bold text-gray-900 text-lg group-hover/topic:text-galaxy-blue transition-colors">
//                           {topic.title}
//                         </h3>
//                         {topic.description && (
//                           <p className="text-gray-500 text-sm mt-1 leading-relaxed line-clamp-2">
//                             {topic.description}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
//                       {isTeacher && (
//                         <>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="cursor-pointer border-blue-100 text-galaxy-blue hover:bg-blue-50 h-9 px-3 rounded-lg"
//                             onClick={() => setActiveTopicForMaterial(topic.id)}
//                           >
//                             <Paperclip className="h-3.5 w-3.5 mr-1" />
//                             Đính kèm
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
//                             onClick={(e) => handleDeleteTopic(topic.id, e)}
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </>
//                       )}
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-9 w-9 text-gray-400 hover:bg-gray-100 rounded-lg cursor-pointer"
//                         onClick={() => toggleExpand(topic.id)}
//                       >
//                         {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//                       </Button>
//                     </div>
//                   </div>

//                   {/* Materials list */}
//                   <AnimatePresence initial={false}>
//                     {isExpanded && (
//                       <motion.div
//                         initial={{ height: 0 }}
//                         animate={{ height: 'auto' }}
//                         exit={{ height: 0 }}
//                         transition={{ duration: 0.25 }}
//                         className="overflow-hidden border-t border-gray-100 bg-gray-50/20"
//                       >
//                         <div className="p-5 space-y-3">
//                           {materials.length === 0 ? (
//                             <div className="text-center py-6 text-gray-400 text-sm">
//                               Chưa có tài liệu đính kèm cho bài giảng này.
//                             </div>
//                           ) : (
//                             materials.map((material) => (
//                               <div
//                                 key={material.id}
//                                 className="flex items-center justify-between p-3 bg-white border border-gray-100 hover:border-blue-200 rounded-xl hover:shadow-xs group/item transition-all"
//                               >
//                                 <a
//                                   href={material.materialType === 'link' ? material.externalUrl || '#' : material.fileUrl || '#'}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="flex items-center gap-3 overflow-hidden flex-1 cursor-pointer"
//                                 >
//                                   {getMaterialIcon(material.materialType)}
//                                   <div className="overflow-hidden pr-2">
//                                     <p className="text-sm font-semibold text-gray-800 group-hover/item:text-galaxy-blue transition-colors truncate flex items-center gap-1.5">
//                                       {material.title}
//                                       {material.materialType === 'link' && <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0" />}
//                                     </p>
//                                     <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
//                                       <Clock className="h-3 w-3" />
//                                       Đăng lúc: {new Date(material.createdAt).toLocaleDateString('vi-VN')}
//                                     </p>
//                                   </div>
//                                   {getMaterialBadge(material.materialType)}
//                                 </a>

//                                 {isTeacher && (
//                                   <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0 cursor-pointer"
//                                     onClick={(e) => handleDeleteMaterial(material.id, e)}
//                                   >
//                                     <Trash2 className="h-3.5 w-3.5" />
//                                   </Button>
//                                 )}
//                               </div>
//                             ))
//                           )}
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </motion.div>
//               );
//             })
//           )}
//         </div>

//         {/* Sidebar Stats & Info Card */}
//         <div className="space-y-6">
//           <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
//             <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
//               <Sparkles className="h-5 w-5 text-amber-500" />
//               Tổng quan môn học
//             </h3>
//             <div className="space-y-4 text-sm">
//               <div className="flex justify-between py-2 border-b border-gray-50">
//                 <span className="text-gray-500">Số chương học</span>
//                 <span className="font-bold text-gray-900">{topics?.length || 0} bài</span>
//               </div>
//               <div className="flex justify-between py-2 border-b border-gray-50">
//                 <span className="text-gray-500">Tổng tài liệu</span>
//                 <span className="font-bold text-gray-900">{totalMaterials} tệp/link</span>
//               </div>
//               <div className="flex justify-between py-2">
//                 <span className="text-gray-500">Quyền tham gia</span>
//                 <span className="font-semibold text-blue-600">
//                   {isTeacher ? 'Giảng viên' : 'Sinh viên'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-galaxy text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
//             <h3 className="font-bold text-lg relative z-10">AI Trợ Lý Bài Giảng</h3>
//             <p className="text-xs text-blue-100 mt-2 leading-relaxed relative z-10">
//               Hệ thống AI thông minh của KEIVerse sẽ phân tích toàn bộ tài liệu bạn tải lên để giải đáp mọi thắc mắc học tập của sinh viên.
//             </p>
//             <Button
//               className="w-full mt-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white cursor-pointer"
//               size="sm"
//             >
//               Hỏi đáp AI
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Upload Material Modal Triggered from activeTopicForMaterial state */}
//       <CreateMaterialModal
//         topicId={activeTopicForMaterial || ''}
//         isOpen={!!activeTopicForMaterial}
//         onOpenChange={(open) => !open && setActiveTopicForMaterial(null)}
//         onSuccess={() => mutate()}
//       />
//     </div>
//   );
// }
