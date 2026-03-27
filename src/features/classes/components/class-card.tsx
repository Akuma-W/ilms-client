'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Class } from '@/types/class';
import { Users, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface ClassCardProps {
  classData: Class;
}

export function ClassCard({ classData }: ClassCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm group">
        <CardHeader className="pb-2 relative">
          {/* For Starred Classes */}
          {/* <div className="absolute top-4 right-4 z-10">
            {classData.isStarred && (
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            )}
          </div> */}
          <div className="w-full h-32 bg-galaxy rounded-xl mb-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-purple-600/20 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-white/20">{classData.courseCode}</span>
            </div>
          </div>
          <Badge variant="secondary" className="w-fit mb-2 bg-blue-50 text-blue-600 border-none font-bold">
            {classData.subject}
          </Badge>
          <CardTitle className="text-xl font-bold line-clamp-1 text-gray-900 group-hover:text-galaxy-blue transition-colors">
            {classData.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
            {classData.description}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <Users className="w-4 h-4 text-galaxy-blue" />
              <span>{classData.teacher.fullName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <Calendar className="w-4 h-4 text-galaxy-blue" />
              <span>{classData.semester}</span>
            </div>
          </div>
        </CardContent>

        {/* For Enrollment Status */}
        <CardFooter className="pt-0 flex justify-between items-center border-t border-gray-50 mt-2 py-4">
          {/* <div className="flex gap-4">
            <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
              <BookOpen className="w-3 h-3" />
              <span>{classData.topicsCount || 0}</span>
            </div>
          </div> */}
          {/* <Badge className="bg-green-50 text-green-600 border-none font-bold capitalize">
            {classData.status}
          </Badge> */}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
