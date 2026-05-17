import { Link, NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <Link to="/leads" className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Smart Leads Dashboard
            </Link>
            <p className="mt-1 text-sm text-slate-600">
              {user?.name}{' '}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium uppercase text-slate-700">
                {user?.role}
              </span>
            </p>
          </div>
          <nav className="flex items-center gap-3">
            <NavLink
              to="/leads"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              Leads
            </NavLink>
            <Button variant="secondary" className="w-auto px-4" onClick={logout}>
              Log out
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
