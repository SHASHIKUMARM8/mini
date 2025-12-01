import AppHeader from '@/components/layout/header';
import { SidebarNav } from '@/components/layout/sidebar-nav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <SidebarNav />
      <main className="flex-1 flex flex-col">
        <AppHeader />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}
