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
import { navItems } from '@/config/layout';

export function Navbar() {
  const pathname = usePathname().replace(/\/$/, '');

  return (
    <nav className="hidden sm:block w-full bg-galaxy-dark py-2">
      <div className="container mx-auto px-4 flex justify-center">
        <NavigationMenu>
          <NavigationMenuList className="gap-6">
            {navItems.map((item) => {
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
                        'text-sm font-medium transition-colors',
                        'hover:text-blue-600',
                        isActive ? 'text-blue-400' : 'text-gray-300',
                      )}
                    >
                      {item.label}
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
