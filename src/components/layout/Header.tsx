'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '../icons';

import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Market' },
    { href: '/watchlist', label: 'Watchlist' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.Logo className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">CoinLook</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  'transition-colors',
                  pathname === item.href
                    ? 'text-foreground font-semibold'
                    : 'text-foreground/60'
                )}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
