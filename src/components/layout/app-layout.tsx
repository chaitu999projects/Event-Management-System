'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Home, PlusCircle, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
                <Sparkles className="text-primary w-8 h-8"/>
                <h1 className="text-2xl font-headline font-bold">EventFlow</h1>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" legacyBehavior passHref>
                <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Events">
                  <Home />
                  <span>Events</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/create" legacyBehavior passHref>
                <SidebarMenuButton asChild isActive={pathname === '/create'} tooltip="Create Event">
                  <PlusCircle />
                  <span>Create Event</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
