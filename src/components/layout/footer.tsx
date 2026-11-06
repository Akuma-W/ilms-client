import { Logo } from '../common/logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SITE_CONFIG, QUICK_LINKS, FOOTER_CONTACTS, SOCIAL_LINKS } from '@/config';

export function Footer() {
  const { name, introduction } = SITE_CONFIG;

  const headingStyle = 'text-white font-semibold mb-4 uppercase tracking-wider text-sm';

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
            <ul className="text-sm grid grid-cols-2 gap-4 sm:block sm:space-y-4">
              {QUICK_LINKS.map((item, idx) => (
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
            <ul className="text-sm space-y-2 sm:space-y-4 ">
              {FOOTER_CONTACTS.map((contact, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <contact.icon className="w-4 h-4 text-blue-400 mt-1" />

                  <div className="space-y-1 flex gap-1">
                    <span className="font-semibold">{contact.title} :</span>
                    {contact.items.map((item, idx) => (
                      <div key={idx}>
                        {'href' in item && item.href ? (
                          <Link
                            href={item.href}
                            className="text-gray-300 hover:text-white transition"
                          >
                            {item.value}
                          </Link>
                        ) : (
                          <span className="text-gray-300">{item.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className={headingStyle}>Theo dõi chúng tôi</h4>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((item, idx) => (
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
