'use client';

import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs / Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-galaxy-blue transition-colors font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Quay lại bộ công cụ
          </Link>
        </motion.div>

        {/* Content Page */}
        {children}
      </div>
    </div>
  );
}
