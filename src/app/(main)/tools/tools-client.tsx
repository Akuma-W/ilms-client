'use client';

import { iconToolMap } from '@/config/tool';
import type { ToolInformation } from '@/types/tool';
import { Sparkles, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

interface ToolsClientProps {
  tools: ToolInformation[];
}

export function ToolsClient({ tools }: ToolsClientProps) {
  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-galaxy-blue/10 text-galaxy-blue rounded-full text-sm font-bold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            KEIVerse Tools
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Công cụ hỗ trợ <span className="text-galaxy-blue">Học tập</span>{' '}
            <span className="text-galaxy-purple">Thông minh</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Tăng hiệu suất học tập với bộ công cụ hỗ trợ mạnh mẽ tích hợp trí tuệ nhân tạo và các
            tiện ích hữu ích.
          </motion.p>
        </div>

        {/* Tools Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          {tools.map((tool, idx) => {
            const Icon = iconToolMap[tool.icon];

            return (
              <Link key={idx} href={tool.href} className="group block h-full">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:shadow-galaxy-blue/10 transition-all hover:-translate-y-2 h-full flex flex-col">
                  <div
                    className={`w-16 h-16 p-3 ${tool.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-8 h-8 ${tool.color}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-galaxy-blue transition-colors">
                    {tool.title}
                  </h2>
                  <p className="text-gray-600 mb-8 flex-1">{tool.description}</p>
                  <div className="flex items-center gap-2 text-galaxy-blue font-bold">
                    Sử dụng ngay
                    <Zap className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
