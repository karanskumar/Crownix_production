import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Upload, Copy, Loader2, ArrowUpDown, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileMeta {
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
}

interface PackageUpload {
  id: string;
  lotAddress: string;
  landSize: string;
  landPrice: string;
  buildSize?: string;
  buildPrice?: string;
  totalPackagePrice?: string;
  productCategory?: string;
  forecastRegistrationDate?: string;
  propertyType?: string;
  floorPlanName?: string;
  facadeName?: string;
  bedroom?: number;
  bath?: number;
  living?: number;
  garage?: number;
  description?: string;
  state?: string;
  stageName?: string;
  status: 'Incomplete' | 'Pending' | 'Reviewed' | 'Approved';
  pricingRequestId?: string;
  lotNumber?: string;
  createdAt: string;
  zohoProductId?: string;
  floorPlanFiles?: FileMeta[];
  sitedFloorPlanFiles?: FileMeta[];
  areaTableFiles?: FileMeta[];
  facadeFiles?: FileMeta[];
  inclusionFiles?: FileMeta[];
  packageFiles?: FileMeta[];
}

interface AdminUser {
  username: string;
  role: string;
  state?: string;
}

const STATUS_COLORS: Record<string, string> = {
  Incomplete: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Reviewed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

const STATUS_LABELS: Record<string, string> = {
  Incomplete: 'Incomplete',
  Pending: 'Pending Approval',
  Reviewed: '1st Approval',
  Approved: 'Approved',
};

const STATUS_ORDER: Record<string, number> = { Incomplete: 0, Pending: 1, Reviewed: 2, Approved: 3 };

type SortOrder = 'default' | 'status-asc' | 'status-desc';

const FIELD_ROWS: Array<{ label: string; key: keyof PackageUpload }> = [
  { label: 'Lot Address (Product Name)', key: 'lotAddress' },
  { label: 'State', key: 'state' },
  { label: 'Stage / Batch', key: 'stageName' },
  { label: 'Forecast Registration Date', key: 'forecastRegistrationDate' },
  { label: 'Land Size (m²)', key: 'landSize' },
  { label: 'Land Price ($)', key: 'landPrice' },
  { label: 'Build Size (m²)', key: 'buildSize' },
  { label: 'Build Price ($)', key: 'buildPrice' },
  { label: 'Total Package Price ($)', key: 'totalPackagePrice' },
  { label: 'Product Category', key: 'productCategory' },
  { label: 'Property Type', key: 'propertyType' },
  { label: 'Floor Plan Name', key: 'floorPlanName' },
  { label: 'Facade Name', key: 'facadeName' },
  { label: 'Bedrooms', key: 'bedroom' },
  { label: 'Bathrooms', key: 'bath' },
  { label: 'Living Areas', key: 'living' },
  { label: 'Garage', key: 'garage' },
  { label: 'Description', key: 'description' },
];

const FILE_CATEGORIES: Array<{ label: string; key: keyof PackageUpload }> = [
  { label: 'Floor Plan Files', key: 'floorPlanFiles' },
  { label: 'Sited Floor Plan Files', key: 'sitedFloorPlanFiles' },
  { label: 'Area Table Files', key: 'areaTableFiles' },
  { label: 'Facade Files', key: 'facadeFiles' },
  { label: 'Inclusion Files', key: 'inclusionFiles' },
  { label: 'Package Files', key: 'packageFiles' },
];

const MANDATORY_FIELDS: Array<keyof PackageUpload> = ['lotAddress', 'buildSize', 'buildPrice', 'landSize', 'landPrice'];

function CrmConfirmModal({
  upload,
  open,
  onClose,
  onConfirm,
  isPending,
}: {
  upload: PackageUpload;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  const missingFields = MANDATORY_FIELDS.filter(f => {
    const val = upload[f];
    return val === undefined || val === null || val === '';
  });

  const allFiles: Array<{ category: string; name: string }> = [];
  for (const cat of FILE_CATEGORIES) {
    const files = upload[cat.key] as FileMeta[] | undefined;
    if (files && files.length > 0) {
      for (const f of files) {
        allFiles.push({ category: cat.label, name: f.originalName });
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto" data-testid="modal-crm-confirm">
        <DialogHeader>
          <DialogTitle>Review Product Creation in CRM</DialogTitle>
        </DialogHeader>

        {missingFields.length > 0 && (
          <div className="flex items-start gap-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 text-sm text-yellow-800 dark:text-yellow-300">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Missing required fields</p>
              <p className="mt-0.5">The following mandatory fields are empty and must be filled before creating the product: {missingFields.join(', ')}.</p>
            </div>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Fields</h3>
            <div className="rounded-md border divide-y text-sm">
              {FIELD_ROWS.map(({ label, key }) => {
                const val = upload[key];
                const displayVal = val !== undefined && val !== null && val !== '' ? String(val) : '—';
                const isMandatory = MANDATORY_FIELDS.includes(key);
                const isEmpty = val === undefined || val === null || val === '';
                return (
                  <div key={key} className="flex items-start px-3 py-2 gap-3">
                    <span className="w-48 shrink-0 text-muted-foreground">
                      {label}
                      {isMandatory && <span className="text-red-500 ml-0.5">*</span>}
                    </span>
                    <span className={isEmpty && isMandatory ? 'text-red-500 font-medium' : 'text-foreground'}>
                      {displayVal}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Files to Attach</h3>
            {allFiles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No files attached to this package.</p>
            ) : (
              <div className="rounded-md border divide-y text-sm">
                {allFiles.map((f, i) => (
                  <div key={i} className="flex items-center px-3 py-2 gap-3">
                    <span className="w-48 shrink-0 text-muted-foreground">{f.category}</span>
                    <span className="text-foreground">{f.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 flex-wrap">
          <Button variant="outline" onClick={onClose} disabled={isPending} data-testid="button-crm-cancel">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending || missingFields.length > 0}
            data-testid="button-crm-confirm"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Product in Zoho CRM'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AdminPackageUploadListPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const [crmModalUpload, setCrmModalUpload] = useState<PackageUpload | null>(null);

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
        const newStatus = result.upload?.status;
        if (newStatus === 'Reviewed') {
          toast({ title: '1st Approval recorded', description: 'Awaiting final approval by admin.' });
        } else if (newStatus === 'Approved') {
          const zohoStatus: string = result.zohoSyncStatus;
          if (zohoStatus === 'synced') {
            toast({
              title: 'Package approved & synced to CRM',
              description: `Zoho Product ID: ${result.zohoProductId}`,
            });
          } else if (zohoStatus === 'skipped') {
            toast({
              title: 'Package approved',
              description: 'CRM already synced previously — no duplicate created.',
            });
          } else {
            toast({
              title: 'Package approved — CRM sync failed',
              description: result.zohoSyncError ?? 'Unknown error. Check server logs.',
              variant: 'destructive',
            });
          }
        }
        queryClient.invalidateQueries({ queryKey: ['/admin/api/package-uploads'] });
        setCrmModalUpload(null);
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
                  <SelectItem value="Reviewed">1st Approval</SelectItem>
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
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Stage</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Land Size</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Land Price</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
                    <th className="text-right px-6 py-3 text-muted-foreground font-medium">Actions</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">CRM Product</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((upload) => (
                    <tr key={upload.id} className="border-b last:border-0" data-testid={`row-package-${upload.id}`}>
                      <td className="px-6 py-3 font-medium text-foreground">{upload.lotAddress}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {upload.stageName ? `Stage ${upload.stageName}` : '—'}
                      </td>
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
                        <div className="flex items-center justify-end gap-1 flex-wrap">
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
                          {!upload.pricingRequestId && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/admin/package-uploads/new?duplicateFrom=${upload.id}`)}
                              title="Duplicate"
                              data-testid={`button-duplicate-${upload.id}`}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}

                          {upload.status === 'Approved' ? (
                            <Badge
                              className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 no-default-active-elevate"
                              data-testid={`badge-approved-${upload.id}`}
                            >
                              Approved
                            </Badge>
                          ) : (upload.status === 'Pending' || upload.status === 'Reviewed') ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => approveMutation.mutate(upload.id)}
                                disabled={approveMutation.isPending || upload.status !== 'Pending'}
                                data-testid={`button-first-approval-${upload.id}`}
                                className="gap-1"
                              >
                                {approveMutation.isPending && upload.status === 'Pending' ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : null}
                                1st Approval
                              </Button>
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setCrmModalUpload(upload)}
                                  disabled={approveMutation.isPending || upload.status !== 'Reviewed'}
                                  data-testid={`button-second-approval-${upload.id}`}
                                  className="gap-1"
                                >
                                  2nd Approval
                                </Button>
                              )}
                            </>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3" data-testid={`cell-crm-${upload.id}`}>
                        {upload.zohoProductId ? (
                          <a
                            href={`https://crm.zoho.in/crm/org60062934311/tab/Products/${upload.zohoProductId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid={`link-crm-product-${upload.id}`}
                          >
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:opacity-80 transition-opacity">
                              Created
                            </span>
                          </a>
                        ) : upload.status === 'Approved' ? (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            data-testid={`badge-crm-failed-${upload.id}`}
                          >
                            Failed
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {crmModalUpload && (
        <CrmConfirmModal
          upload={crmModalUpload}
          open={true}
          onClose={() => setCrmModalUpload(null)}
          onConfirm={() => approveMutation.mutate(crmModalUpload.id)}
          isPending={approveMutation.isPending}
        />
      )}
    </div>
  );
}
