'use client';

import { ContactSection } from '@/components/common/contact-section';
import { Card, CardContent } from '@/components/ui/card';
import { contacts } from '@/config/layout';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export function ContactClient() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Liên hệ với <span className="text-galaxy-blue">KEI</span>
          <span className="text-galaxy-purple">Verse</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy gửi tin nhắn cho chúng tôi nếu bạn có
          bất kỳ thắc mắc nào.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-5 lg:col-span-1 items-stretch">
          {contacts.map((contact, idx) => {
            const Icon = contact.icon;

            return (
              <motion.div
                key={contact.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <Card className="border-gray-100 shadow-sm">
                  <CardContent className="px-6 flex gap-4">
                    <div className={cn('p-3 rounded-xl', contact.color)}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col justify-between">
                      <h3 className="font-semibold text-gray-900">{contact.title}</h3>
                      {contact.items.map((item, idx) => (
                        <p key={idx} className="text-gray-600 text-sm mt-1">
                          {'href' in item && item.href ? (
                            <Link href={item.href} className="hover:underline">
                              {'label' in item && item.label ? `${item.label}: ` : ''}
                              {item.value}
                            </Link>
                          ) : (
                            <>
                              {'label' in item && item.label ? `${item.label}: ` : ''}
                              {item.value}
                            </>
                          )}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <ContactSection defaultType="contact" />
        </motion.div>
      </div>

      {/* Map Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-16 rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-100 bg-gray-200 relative"
      >
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 flex-col gap-2">
          <MapPin className="w-12 h-12" />
          <p className="font-medium">Bản đồ vị trí KEIVerse</p>
          <p className="text-sm">{contacts.find((c) => c.key === 'address')?.items[0].value}</p>
        </div>
        {/* Google Map */}
      </motion.div>
    </div>
  );
}
