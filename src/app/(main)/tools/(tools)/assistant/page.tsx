'use client';

import { Bot, Sparkles, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/**
 * AI Assistant preview placeholder page.
 * Notifies users that the integrated AI learning assistant is currently under development.
 */
export default function AIAssistant() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6">
        <Link href="/tools">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer gap-2 text-gray-600 hover:text-galaxy-blue"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại Công cụ
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="overflow-hidden border-border/80 shadow-lg">
          <div className="h-2 bg-galaxy" />
          <CardHeader className="text-center py-10 space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-galaxy-purple/10 text-galaxy-purple">
              <Bot className="h-9 w-9" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
              Trợ lý Học tập AI KEIVerse
            </CardTitle>
            <CardDescription className="text-base max-w-md mx-auto text-gray-500">
              Tính năng hỏi đáp và trợ giúp học tập thông minh đang được nâng cấp để kết nối trực
              tiếp với tài liệu lớp học của bạn.
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-12 text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-galaxy-blue">
              <Clock className="h-3.5 w-3.5" />
              Đang phát triển (Coming Soon)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4 text-left">
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                <Sparkles className="h-5 w-5 text-amber-500 mb-2" />
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Giải đáp học tập</h4>
                <p className="text-xs text-gray-500">
                  Hỗ trợ trả lời câu hỏi và làm rõ khái niệm chuyên môn.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                <Bot className="h-5 w-5 text-galaxy-blue mb-2" />
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Gắn liền học liệu</h4>
                <p className="text-xs text-gray-500">
                  Phân tích trực tiếp nội dung bài giảng và tài liệu của môn học.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                <Sparkles className="h-5 w-5 text-galaxy-purple mb-2" />
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Lộ trình ôn tập</h4>
                <p className="text-xs text-gray-500">
                  Gợi ý câu hỏi và bài tập phù hợp với tiến độ cá nhân.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
