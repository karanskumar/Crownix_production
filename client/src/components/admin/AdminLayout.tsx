import { useEffect, useState } from 'react';
import lionLogo from '@assets/crownix_logo_1762957456049-7QivhraH_1774259515259.png';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, FileText, Package, TrendingUp, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { queryClient } from '@/lib/queryClient';

interface AdminUser {
  username: string;
  role: string;
  state?: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/admin/api/me', { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          navigate('/admin/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data?.success) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => {
        navigate('/admin/login');
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = async () => {
    await fetch('/admin/api/logout', { method: 'POST', credentials: 'include' });
    queryClient.clear();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
    { href: '/admin/pricing-requests/new', label: 'Pricing Requests', icon: FileText, adminOnly: true },
    { href: '/admin/package-uploads', label: 'Package Upload', icon: Package, adminOnly: false },
    { href: '/admin/active-deals', label: 'Active Deals', icon: TrendingUp, adminOnly: false },
  ].filter(item => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="flex items-center justify-between px-6 py-3 gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img
                src={lionLogo}
                alt="Crownix lion"
                className="h-8 w-auto object-contain"
              />
              <span className="font-semibold text-foreground text-lg">Crownix Admin</span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      className="gap-2"
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.username}
              {user.state ? ` (${user.state})` : user.role === 'admin' ? ' (Admin)' : ''}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="flex md:hidden border-t px-4 py-2 gap-1 overflow-x-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className="gap-1 shrink-0"
                  data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
