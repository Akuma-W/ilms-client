'use client';

import { Bot, Trash2, User, Sparkles, Loader2, Send, Brain } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Chào bạn! Mình là trợ lý AI của KEIVerse. Mình có thể giúp gì cho bạn hôm nay?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.text || 'Không có phản hồi',
        },
      ]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chào bạn! Mình là trợ lý AI của KEIVerse. Mình có thể giúp gì cho bạn hôm nay?',
      },
    ]);
  };

  return (
    <>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-galaxy-purple/10 rounded-2xl">
            <Brain className="w-8 h-8 text-galaxy-purple" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Trợ lý AI Thông minh
            </h1>
            <p className="text-gray-600">
              Sử dụng trí tuệ nhân tạo để giải đáp thắc mắc và hỗ trợ học tập.
            </p>
          </div>
        </div>
      </div>

      {/* Main Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col h-150">
          <div className="flex items-center justify-between mb-6 pb-4 border-bottom border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-galaxy-blue/10 rounded-2xl">
                <Bot className="w-6 h-6 text-galaxy-blue" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Trợ lý AI</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-500 font-medium">Đang hoạt động</span>
                </div>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Xóa cuộc trò chuyện"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar"
          >
            <AnimatePresence mode="popLayout">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'user'
                          ? 'bg-galaxy-purple text-white'
                          : 'bg-galaxy-blue text-white'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-galaxy-purple text-white rounded-tr-none'
                          : 'bg-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-galaxy-blue text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-4 bg-gray-100 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-5 h-5 animate-spin text-galaxy-blue" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi mình bất cứ điều gì..."
              className="w-full pl-6 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-galaxy-blue focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-galaxy-blue text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-galaxy-blue transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
}
