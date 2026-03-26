import { Logo } from '../common/logo';
import Link from 'next/link';
import { Facebook, Github, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config';

export function Footer() {
  const { name, introduction } = siteConfig;

  const headingStyle = 'text-white font-semibold mb-4 uppercase tracking-wider text-sm';

  const quickLinks = [
    { label: 'Tham gia ngay', href: '/login' },
    { label: 'Lớp học', href: '/classes' },
    { label: 'Ôn tập Quiz', href: '/quizzes' },
    { label: 'Liên hệ', href: '/contact' },
  ];

  const contacts = [
    { icon: Phone, content: '+84 961 243 758' },
    { icon: Mail, content: 'keiverse41@gmail.com' },
    { icon: MapPin, content: 'Thành phố Hồ Chí Minh, Việt Nam' },
  ];

  const socials = [
    { icon: Facebook, href: 'https://www.facebook.com', hover: 'hover:bg-blue-500' },
    { icon: Linkedin, href: 'https://www.linkedin.com', hover: 'hover:bg-blue-700' },
    { icon: Github, href: 'https://www.github.com', hover: 'hover:bg-gray-600' },
    { icon: Youtube, href: 'https://www.youtube.com', hover: 'hover:bg-red-600' },
  ];

  return (
    <footer className="bg-galaxy-dark text-gray-300 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-10">
          {/* Brand Section */}
          <div className="space-y-1">
            <Logo size="lg" variant="dark" />
            <p className="text-sm leading-relaxed">
              <span className="font-bold">{name}</span>
              {' ' + introduction}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={headingStyle}>Liên kết nhanh</h4>
            <ul className="space-y-4 text-sm">
              {quickLinks.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-blue-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={headingStyle}>Thông tin liên hệ</h4>
            <ul className="space-y-4 text-sm">
              {contacts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <item.icon className="w-4 h-4 text-blue-400 mt-1" />
                  <span>{item.content}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className={headingStyle}>Theo dõi chúng tôi</h4>
            <div className="flex items-center gap-4">
              {socials.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className={cn(
                    'w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transition-all',
                    item.hover,
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>
            &#169; {new Date().getFullYear()} {name}. All rights reserved. Designed for students.
          </p>
        </div>
      </div>
    </footer>
  );
}
