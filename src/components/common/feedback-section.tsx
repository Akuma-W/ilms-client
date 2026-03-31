'use client';

import { Send } from 'lucide-react';
import { Button } from '../ui/button';
import { WEB3FORMS_ACCESS_KEY } from '@/config';

export function FeedbackSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-galaxy rounded-[2rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full -translate-x-1/4 translate-y-1/4 blur-3xl"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Gửi phản hồi cho chúng tôi</h2>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Ý kiến của bạn là động lực để chúng tôi hoàn thiện KEIVerse mỗi ngày. Đừng ngần ngại
                chia sẻ trải nghiệm của bạn nhé!
              </p>
            </div>

            {/* Form Feedback */}
            <form
              action="https://api.web3forms.com/submit"
              method="POST"
              className="space-y-4 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10"
            >
              <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-blue-50">
                  Họ và tên
                </label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  type="text"
                  placeholder="Nhập tên của bạn"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="feedback" className="text-sm font-medium text-blue-50">
                  Nội dung phản hồi
                </label>
                <textarea
                  id="feedback"
                  name="message"
                  required
                  rows={4}
                  placeholder="Bạn cảm thấy thế nào về KEIVerse?"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none"
                ></textarea>
              </div>
              <Button className="w-full bg-white text-galaxy-blue hover:bg-blue-50 font-bold py-6 rounded-xl">
                Gửi ngay
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
