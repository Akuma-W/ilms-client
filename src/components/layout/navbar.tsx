'use client';

import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../ui/navigation-menu';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MAIN_NAV_ITEMS } from '@/config';

export function Navbar() {
  const pathname = usePathname().replace(/\/$/, '');

  return (
    <nav className="hidden sm:block w-full bg-slate-900 border-b border-slate-800 py-1 backdrop-blur-md">
      <div className="container mx-auto px-4 flex justify-center">
        <NavigationMenu>
          <NavigationMenuList className="flex flex-row items-center gap-8">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = item.href === '/' ? pathname === '' : pathname.startsWith(item.href);

              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={(e) => {
                        (e.currentTarget as HTMLAnchorElement).blur();
                      }}
                      className={cn(
                        'text-sm transition-all duration-200 py-2 flex flex-row items-center gap-2 whitespace-nowrap',
                        isActive
                          ? 'text-cyan-400 font-bold border-b-2 border-cyan-400 hover:text-galaxy-purple hover:border-galaxy-purple'
                          : 'text-slate-100 font-semibold hover:text-galaxy-blue',
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0 text-inherit" />
                      <span>{item.label}</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
