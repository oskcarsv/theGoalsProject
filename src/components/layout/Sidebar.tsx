'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Target,
  LayoutDashboard,
  Goal,
  CalendarCheck,
  Trophy,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';

interface SidebarProps {
  profile: Profile;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Mis Metas', href: '/goals', icon: Goal },
  { name: 'Review Semanal', href: '/review', icon: CalendarCheck },
  { name: 'Ranking', href: '/ranking', icon: Trophy },
  { name: 'Match', href: '/match', icon: Users },
];

const adminNavigation = [
  { name: 'Panel Admin', href: '/admin', icon: Shield },
];

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const NavLinks = () => (
    <>
      <nav className="flex-1 space-y-1 py-4 px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-smooth',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-[1.02]'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:scale-[1.01]'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}

        {profile.role === 'admin' && (
          <>
            <div className="px-3 py-4">
              <Separator />
            </div>
            {adminNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all',
                    isActive
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="p-3 space-y-1">
        <Separator className="mb-3" />
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-xs font-medium text-muted-foreground">Tema</span>
          <ThemeToggle />
        </div>
        <Link
          href="/settings"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Settings className="h-5 w-5" />
          Configuración
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-card/80 border-b border-border px-4 py-3 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-smooth">
            <Target className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">The Goals Project</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="transition-smooth hover:scale-110">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-background/80 backdrop-blur-md transition-smooth" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border pt-16 shadow-2xl transform transition-smooth"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <NavLinks />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 bg-card border-r border-border z-20 shadow-xl">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-smooth hover:scale-110">
            <Target className="h-5 w-5" />
          </div>
          <span className="text-base font-bold tracking-tight">The Goals Project</span>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <NavLinks />
        </div>
      </aside>

      {/* Spacer for desktop sidebar to push content */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
}
