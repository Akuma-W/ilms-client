// 'use client';

// import { useState } from 'react';
// import {
//   FileText,
//   Link as LinkIcon,
//   Play,
//   Presentation,
//   Search,
//   BookOpen,
//   FolderMinus,
//   Sparkles,
//   Download,
//   ExternalLink,
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'motion/react';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Material } from '@/types';

// interface MaterialsClientProps {
//   initialMaterials: (Material & { topicTitle: string })[];
// }

// export function MaterialsClient({ initialMaterials }: MaterialsClientProps) {
//   const [search, setSearch] = useState('');
//   const [activeFilter, setActiveFilter] = useState<'all' | 'pdf' | 'slide' | 'video' | 'document' | 'link'>('all');

//   const getMaterialIcon = (type: string) => {
//     switch (type) {
//       case 'video':
//         return <Play className="h-6 w-6 text-blue-500 shrink-0" />;
//       case 'pdf':
//         return <FileText className="h-6 w-6 text-red-500 shrink-0" />;
//       case 'slide':
//         return <Presentation className="h-6 w-6 text-orange-500 shrink-0" />;
//       case 'document':
//         return <FileText className="h-6 w-6 text-emerald-500 shrink-0" />;
//       default:
//         return <LinkIcon className="h-6 w-6 text-purple-500 shrink-0" />;
//     }
//   };

//   const getMaterialColorClass = (type: string) => {
//     switch (type) {
//       case 'video':
//         return 'from-blue-500/10 to-blue-600/5 hover:border-blue-300';
//       case 'pdf':
//         return 'from-red-500/10 to-red-600/5 hover:border-red-300';
//       case 'slide':
//         return 'from-orange-500/10 to-orange-600/5 hover:border-orange-300';
//       case 'document':
//         return 'from-emerald-500/10 to-emerald-600/5 hover:border-emerald-300';
//       default:
//         return 'from-purple-500/10 to-purple-600/5 hover:border-purple-300';
//     }
//   };

//   // Filter materials
//   const filteredMaterials = initialMaterials.filter((material) => {
//     const matchesSearch = material.title.toLowerCase().includes(search.toLowerCase());
//     const matchesType = activeFilter === 'all' || material.materialType === activeFilter;
//     return matchesSearch && matchesType;
//   });

//   // Calculate stats
//   const totalCount = initialMaterials.length;
//   const pdfCount = initialMaterials.filter(m => m.materialType === 'pdf').length;
//   const slideCount = initialMaterials.filter(m => m.materialType === 'slide').length;
//   const videoCount = initialMaterials.filter(m => m.materialType === 'video').length;
//   const docCount = initialMaterials.filter(m => m.materialType === 'document').length;
//   const linkCount = initialMaterials.filter(m => m.materialType === 'link').length;

//   return (
//     <div className="container mx-auto lg:max-w-7xl pb-16">
//       {/* Header info */}
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <FileText className="h-6 w-6 text-galaxy-blue" />
//           Thư viện tài liệu
//         </h2>
//         <p className="text-gray-500 text-sm mt-0.5">
//           Tất cả học liệu của khóa học được tổng hợp và phân loại có khoa học
//         </p>
//       </div>

//       {/* Grid of group stats */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
//         {[
//           { label: 'Tất cả', count: totalCount, icon: BookOpen, type: 'all', color: 'text-galaxy-blue bg-blue-50 border-blue-100' },
//           { label: 'Tài liệu PDF', count: pdfCount, icon: FileText, type: 'pdf', color: 'text-red-600 bg-red-50 border-red-100' },
//           { label: 'Slide bài giảng', count: slideCount, icon: Presentation, type: 'slide', color: 'text-orange-600 bg-orange-50 border-orange-100' },
//           { label: 'Video học tập', count: videoCount, icon: Play, type: 'video', color: 'text-blue-600 bg-blue-50 border-blue-100' },
//           { label: 'Văn bản (Docs)', count: docCount, icon: FileText, type: 'document', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
//           { label: 'Liên kết ngoài', count: linkCount, icon: LinkIcon, type: 'link', color: 'text-purple-600 bg-purple-50 border-purple-100' },
//         ].map((stat) => (
//           <div
//             key={stat.type}
//             onClick={() => setActiveFilter(stat.type as typeof activeFilter)}
//             className={`border rounded-2xl p-4 cursor-pointer select-none text-center hover:-translate-y-1 transition-all duration-300 ${
//               activeFilter === stat.type
//                 ? 'bg-galaxy text-white border-transparent shadow-md'
//                 : 'bg-white text-gray-700 border-gray-100 shadow-xs'
//             }`}
//           >
//             <div className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2 font-bold ${
//               activeFilter === stat.type ? 'bg-white/25 text-white' : stat.color
//             }`}>
//               <stat.icon className="h-4 w-4" />
//             </div>
//             <p className="text-[11px] font-bold tracking-wide uppercase opacity-80">{stat.label}</p>
//             <p className="text-2xl font-black mt-1">{stat.count}</p>
//           </div>
//         ))}
//       </div>

//       {/* Search & Filter Toolbar */}
//       <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white border border-gray-100 rounded-2xl p-4 shadow-xs">
//         <div className="relative w-full md:w-80">
//           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input
//             placeholder="Tìm kiếm tài liệu học tập..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-10"
//           />
//         </div>

//         <Tabs value={activeFilter} className="w-full md:w-auto">
//           <TabsList className="grid grid-cols-3 md:flex gap-1 bg-gray-100/60 p-1 rounded-xl h-auto">
//             {[
//               { label: 'Tất cả', val: 'all' },
//               { label: 'Tệp PDF', val: 'pdf' },
//               { label: 'Slide', val: 'slide' },
//               { label: 'Video', val: 'video' },
//               { label: 'Docs', val: 'document' },
//               { label: 'Links', val: 'link' },
//             ].map((tab) => (
//               <TabsTrigger
//                 key={tab.val}
//                 value={tab.val}
//                 onClick={() => setActiveFilter(tab.val as typeof activeFilter)}
//                 className="cursor-pointer text-xs rounded-lg py-1.5 px-3"
//               >
//                 {tab.label}
//               </TabsTrigger>
//             ))}
//           </TabsList>
//         </Tabs>
//       </div>

//       {/* Materials List */}
//       <AnimatePresence mode="popLayout">
//         {filteredMaterials.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.98 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.98 }}
//             className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-xs flex flex-col items-center"
//           >
//             <FolderMinus className="h-12 w-12 text-gray-300 mb-3" />
//             <h3 className="text-base font-bold text-gray-700">Không tìm thấy tài liệu nào</h3>
//             <p className="text-gray-400 text-sm mt-1">
//               Vui lòng đổi từ khóa tìm kiếm hoặc chọn bộ lọc tệp tin khác.
//             </p>
//           </motion.div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {filteredMaterials.map((material, idx) => (
//               <motion.div
//                 key={material.id}
//                 layout
//                 initial={{ opacity: 0, y: 12 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -12 }}
//                 transition={{ duration: 0.25, delay: idx * 0.02 }}
//                 className={`bg-linear-to-br ${getMaterialColorClass(
//                   material.materialType
//                 )} bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group/card`}
//               >
//                 {getMaterialIcon(material.materialType)}

//                 <div className="flex-1 overflow-hidden">
//                   <h4 className="font-bold text-gray-900 group-hover/card:text-galaxy-blue transition-colors truncate">
//                     {material.title}
//                   </h4>
//                   <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5 shrink-0">
//                     <BookOpen className="h-3.5 w-3.5" />
//                     Chương: {material.topicTitle}
//                   </p>
//                   <p className="text-[10px] text-gray-400 mt-0.5">
//                     Tải lên lúc: {new Date(material.createdAt).toLocaleDateString('vi-VN')}
//                   </p>

//                   <div className="flex items-center gap-2 mt-4">
//                     <a
//                       href={material.materialType === 'link' ? material.externalUrl || '#' : material.fileUrl || '#'}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="cursor-pointer bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors"
//                     >
//                       {material.materialType === 'link' ? (
//                         <>
//                           <ExternalLink className="h-3.5 w-3.5 text-purple-600" />
//                           Mở liên kết
//                         </>
//                       ) : (
//                         <>
//                           <Download className="h-3.5 w-3.5 text-blue-600" />
//                           Tải tệp tin
//                         </>
//                       )}
//                     </a>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
