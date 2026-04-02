import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, CheckCircle, Copy, Loader2, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PackageUpload {
  id: string;
  lotAddress: string;
  landSize: string;
  landPrice: string;
  status: 'Incomplete' | 'Pending' | 'Approved';
  state?: string;
  floorPlanName?: string;
  pricingRequestId?: string;
  createdAt: string;
}

interface AdminUser {
  username: string;
  role: string;
  state?: string;
}

const STATUS_COLORS: Record<string, string> = {
  Incomplete: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

const STATUS_LABELS: Record<string, string> = {
  Incomplete: 'Incomplete',
  Pending: 'Pending Approval',
  Approved: 'Approved',
};

const STATUS_ORDER: Record<string, number> = { Incomplete: 0, Pending: 1, Approved: 2 };

type SortOrder = 'default' | 'status-asc' | 'status-desc';

export function AdminPackageUploadListPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');

  const { data: meData } = useQuery<{ success: boolean; user: AdminUser }>({
    queryKey: ['/admin/api/me'],
    queryFn: () => fetch('/admin/api/me', { credentials: 'include' }).then(r => r.json()),
  });

  const { data, isLoading } = useQuery<{ success: boolean; uploads: PackageUpload[] }>({
    queryKey: ['/admin/api/package-uploads'],
    queryFn: () => fetch('/admin/api/package-uploads', { credentials: 'include' }).then(r => r.json()),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/admin/api/package-uploads/${id}/approve`, {
        method: 'POST',
        credentials: 'include',
      }).then(r => r.json()),
    onSuccess: (result) => {
      if (result.success) {
        toast({ title: 'Package approved', description: 'Approval emails sent.' });
        queryClient.invalidateQueries({ queryKey: ['/admin/api/package-uploads'] });
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to approve package.', variant: 'destructive' });
    },
  });

  const uploads = data?.uploads ?? [];
  const isAdmin = meData?.user?.role === 'admin';

  const filtered = statusFilter === 'all'
    ? uploads
    : uploads.filter(u => u.status === statusFilter);

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'status-asc') return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (sortOrder === 'status-desc') return STATUS_ORDER[b.status] - STATUS_ORDER[a.status];
    return 0;
  });

  const cycleSortOrder = () => {
    setSortOrder(prev =>
      prev === 'default' ? 'status-asc' : prev === 'status-asc' ? 'status-desc' : 'default'
    );
  };

  const sortLabel = sortOrder === 'status-asc' ? 'Status: A→Z' : sortOrder === 'status-desc' ? 'Status: Z→A' : 'Sort';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Package Upload</h1>
          <p className="text-muted-foreground mt-1">Manage package uploads and approvals</p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => navigate('/admin/package-uploads/new')}
            data-testid="button-create-new"
          >
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">Packages</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={cycleSortOrder}
                data-testid="button-sort-status"
                className="gap-1.5"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                {sortLabel}
              </Button>
              <span className="text-sm text-muted-foreground">Filter:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44" data-testid="select-status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Incomplete">Incomplete</SelectItem>
                  <SelectItem value="Pending">Pending Approval</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No packages found.</p>
              {statusFilter !== 'all' && (
                <p className="text-sm mt-1">Try changing the filter.</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left px-6 py-3 text-muted-foreground font-medium">Lot Address</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Land Size</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Land Price</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
                    <th className="text-right px-6 py-3 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((upload) => (
                    <tr key={upload.id} className="border-b last:border-0" data-testid={`row-package-${upload.id}`}>
                      <td className="px-6 py-3 font-medium text-foreground">{upload.lotAddress}</td>
                      <td className="px-4 py-3 text-muted-foreground">{upload.landSize} sqm</td>
                      <td className="px-4 py-3 text-muted-foreground">${upload.landPrice}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[upload.status]}`}
                          data-testid={`status-package-${upload.id}`}
                        >
                          {STATUS_LABELS[upload.status] ?? upload.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/package-uploads/${upload.id}/upload`)}
                            className="gap-1.5"
                            data-testid={`button-upload-${upload.id}`}
                          >
                            <Upload className="h-3.5 w-3.5" />
                            Upload
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/package-uploads/new?duplicateFrom=${upload.id}`)}
                            title="Duplicate"
                            data-testid={`button-duplicate-${upload.id}`}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {isAdmin && upload.status !== 'Approved' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => approveMutation.mutate(upload.id)}
                              disabled={approveMutation.isPending}
                              title="Approve"
                              data-testid={`button-approve-${upload.id}`}
                            >
                              {approveMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
