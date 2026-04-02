import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Package, TrendingUp, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface AdminUser {
  username: string;
  role: string;
  state?: string;
}

const ALL_TILES = [
  {
    title: 'Pricing Requests',
    description: 'Submit new pricing requests for NSW, QLD, and VIC estates. Automatically notifies the relevant state team.',
    icon: FileText,
    href: '/admin/pricing-requests/new',
    action: 'New Pricing Request',
    testId: 'tile-pricing-requests',
    adminOnly: true,
  },
  {
    title: 'Package Upload',
    description: 'Manage package uploads for submitted pricing requests. Review and upload packages.',
    icon: Package,
    href: '/admin/package-uploads',
    action: 'View Packages',
    testId: 'tile-package-upload',
    adminOnly: false,
  },
  {
    title: 'Active Deals',
    description: 'View and manage active deals in progress across all states.',
    icon: TrendingUp,
    href: '/admin/active-deals',
    action: 'View Deals',
    testId: 'tile-active-deals',
    adminOnly: false,
  },
];

export function AdminDashboardPage() {
  const { data: meData } = useQuery<{ success: boolean; user: AdminUser }>({
    queryKey: ['/admin/api/me'],
    queryFn: () => fetch('/admin/api/me', { credentials: 'include' }).then(r => r.json()),
  });

  const isAdmin = meData?.user?.role === 'admin';
  const tiles = ALL_TILES.filter(t => !t.adminOnly || isAdmin);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to the Crownix admin portal</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiles.map(tile => (
          <Card key={tile.href} className="flex flex-col" data-testid={tile.testId}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-primary/10">
                  <tile.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">{tile.title}</CardTitle>
              </div>
              <CardDescription>{tile.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 mt-auto">
              <Link to={tile.href}>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  data-testid={`button-${tile.testId}`}
                >
                  {tile.action}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
