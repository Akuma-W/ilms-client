import { Logo } from '../common/logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SITE_CONFIG, QUICK_LINKS, LEGAL_LINKS, FOOTER_CONTACTS, SOCIAL_LINKS } from '@/config';

export function Footer() {
  const { name, introduction } = SITE_CONFIG;

  const headingStyle = 'text-white font-bold mb-4 uppercase tracking-wider text-xs';

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 pt-12 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-3">
            <Logo size="lg" variant="dark" withSlogan={true} />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              <span className="font-bold text-white">{name}</span> {introduction}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={headingStyle}>Khám phá</h4>
            <ul className="text-sm space-y-3">
              {QUICK_LINKS.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-cyan-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Academic */}
          <div>
            <h4 className={headingStyle}>Pháp lý & Quy chế</h4>
            <ul className="text-sm space-y-3">
              {LEGAL_LINKS.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-cyan-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info & Socials */}
          <div className="space-y-4">
            <h4 className={headingStyle}>Thông tin liên hệ</h4>
            <ul className="text-xs sm:text-sm space-y-2 text-slate-400">
              {FOOTER_CONTACTS.map((contact, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <contact.icon className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium text-slate-300">{contact.title}: </span>
                    {contact.items.map((item, i) => (
                      <span key={i}>
                        {'href' in item && item.href ? (
                          <Link href={item.href} className="hover:text-white transition-colors">
                            {item.value}
                          </Link>
                        ) : (
                          item.value
                        )}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white transition-all',
                      item.hover,
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &#169; {new Date().getFullYear()} {name}. Nền tảng học tập trực tuyến thông minh.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/terms" className="hover:text-cyan-400 transition-colors">
              Điều khoản
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
              Bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
