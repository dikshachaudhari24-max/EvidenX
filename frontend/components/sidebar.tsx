'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  BarChart3,
  FileText,
  Users,
  Database,
  Zap,
  ShieldAlert,
  Package,
  NotebookPen,
  LogOut,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/evidence', label: 'Evidence', icon: Package },
  { href: '/custody-events', label: 'Custody Events', icon: FileText },
  { href: '/actors', label: 'Actors', icon: Users },
  { href: '/sql-views', label: 'SQL Views', icon: Database },
  { href: '/triggers', label: 'Triggers', icon: Zap },
  { href: '/audit', label: 'Integrity Audit', icon: ShieldAlert },
];

const investigatorNavItem = {
  href: '/investigator',
  label: 'Investigation Reports',
  icon: NotebookPen,
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const canSeeInvestigationReports = user?.role === 'investigator' || user?.role === 'admin';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-lg font-bold text-sidebar-foreground">EvidenX</h1>
        <p className="text-xs text-sidebar-accent-foreground mt-1">Evidence Management</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {[...navItems, ...(canSeeInvestigationReports ? [investigatorNavItem] : [])].map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-accent-foreground hover:bg-sidebar-accent'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border space-y-3">
        <div className="bg-sidebar-accent/50 rounded-lg p-3">
          <p className="text-xs font-medium text-sidebar-foreground">{user?.name}</p>
          <p className="text-xs text-sidebar-accent-foreground capitalize">{user?.role}</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-sidebar-border text-sidebar-accent-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
