'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FilePlus2,
  LayoutDashboard,
  PackageCheck,
  Search,
  ShieldCheck,
  Users,
  Wind,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

const mainNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/report/lost', label: 'Report Lost Item', icon: FilePlus2 },
  { href: '/items/found', label: 'Browse Found Items', icon: Search },
  { href: '/my-claims', label: 'My Claims', icon: PackageCheck },
];

const adminNav = [
  { href: '/admin/review', label: 'Review Items', icon: ShieldCheck },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
];

export function SidebarNav() {
  const pathname = usePathname();

  const renderNav = (items: typeof mainNav) => {
    return items.map((item) => (
      <li key={item.href}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              className={cn(
                'flex items-center justify-center lg:justify-start gap-3 rounded-lg p-3 text-muted-foreground transition-colors hover:text-primary hover:bg-accent',
                pathname === item.href && 'bg-accent text-primary'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="hidden lg:inline font-medium">{item.label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="block lg:hidden">
            {item.label}
          </TooltipContent>
        </Tooltip>
      </li>
    ));
  };

  return (
    <aside className="hidden sm:flex flex-col border-r bg-card">
      <TooltipProvider delayDuration={0}>
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-4 lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-bold font-headline">
              <Wind className="h-6 w-6 text-primary" />
              <span className="hidden lg:inline">FindMeNow</span>
            </Link>
          </div>
          <nav className="flex-1 p-2 lg:p-4">
            <ul className="space-y-1">{renderNav(mainNav)}</ul>
            <Separator className="my-4" />
            <div className="px-3 py-2">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight hidden lg:block">
                Admin
              </h2>
              <ul className="space-y-1">{renderNav(adminNav)}</ul>
            </div>
          </nav>
        </div>
      </TooltipProvider>
    </aside>
  );
}
