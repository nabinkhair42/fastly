'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'grid grid-cols-2 lg:grid-cols-1 space-x-2 lg:space-x-0 lg:space-y-1 p-2',
        className
      )}
      {...props}
    >
      {items.map(item => (
        <Button
          asChild
          key={item.href}
          variant={'ghost'}
          className={cn(
            'text-left justify-start text-sm col-span-1 w-full',
            pathname === item.href && 'bg-primary/10 hover:bg-primary/15'
          )}
        >
          <Link key={item.href} href={item.href}>
            <div className="flex items-center gap-2">{item.icon}</div>
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
