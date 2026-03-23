import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Pencil, Download } from 'lucide-react';
import type { PackageUpload } from '@shared/schema';

const STATUS_COLORS: Record<string, string> = {
  Incomplete: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm text-foreground" data-testid={`field-${label.toLowerCase().replace(/\s+/g, '-')}`}>{value}</p>
    </div>
  );
}

export function AdminPackageUploadViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<{ success: boolean; upload: PackageUpload }>({
    queryKey: ['/admin/api/package-uploads', id],
    queryFn: () =>
      fetch(`/admin/api/package-uploads/${id}`, { credentials: 'include' }).then(r => r.json()),
    enabled: !!id,
  });

  const upload = data?.upload;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/package-uploads')}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Package Details</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Read-only view</p>
        </div>
        {upload && (
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/package-uploads/${id}/edit`)}
            data-testid="button-edit"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !upload ? (
        <div className="text-center py-16 text-muted-foreground">Package not found.</div>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <CardTitle className="text-base">Package Information</CardTitle>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[upload.status]}`}
                  data-testid="status-badge"
                >
                  {upload.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Lot Address" value={upload.lotAddress} />
              <Field label="State" value={upload.state} />
              <Field label="Land Size" value={upload.landSize ? `${upload.landSize} sqm` : undefined} />
              <Field label="Land Price" value={upload.landPrice ? `$${upload.landPrice}` : undefined} />
              <Field label="Floor Plan Name" value={upload.floorPlanName} />
              <Field label="Floor Plan Size" value={upload.floorPlanSize} />
              <Field label="Facade Name" value={upload.facadeName} />
              <Field label="Registration" value={upload.registration} />
            </CardContent>
          </Card>

          {(upload.floorPlanFiles?.length ?? 0) > 0 ||
           (upload.sitedFloorPlanFiles?.length ?? 0) > 0 ||
           (upload.areaTableFiles?.length ?? 0) > 0 ||
           (upload.facadeFiles?.length ?? 0) > 0 ||
           (upload.inclusionFiles?.length ?? 0) > 0 ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Uploaded Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Floor Plan', files: upload.floorPlanFiles },
                  { label: 'Sited Floor Plan', files: upload.sitedFloorPlanFiles },
                  { label: 'Area Table', files: upload.areaTableFiles },
                  { label: 'Facade', files: upload.facadeFiles },
                  { label: 'Inclusions', files: upload.inclusionFiles },
                ].map(({ label, files }) =>
                  files && files.length > 0 ? (
                    <div key={label}>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{label}</p>
                      <ul className="space-y-1">
                        {files.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <a
                              href={`/admin/api/files/${f.filename}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary underline underline-offset-2 hover:opacity-80 flex items-center gap-1.5 min-w-0"
                              data-testid={`file-link-${i}`}
                            >
                              <Download className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{f.originalName}</span>
                            </a>
                            <span className="text-xs text-muted-foreground shrink-0">({Math.round(f.size / 1024)} KB)</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}
