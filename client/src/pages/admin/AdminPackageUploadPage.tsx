import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Loader2, ArrowLeft, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FileMeta, PackageUpload, PricingRequest } from '@shared/schema';

interface FormValues {
  lotAddress: string;
  landSize: string;
  landPrice: string;
  buildSize: string;
  buildPrice: string;
  totalPackagePrice: string;
  productCategory: string;
  forecastRegistrationDate: string;
  stageName: string;
  propertyType: string;
  floorPlanName: string;
  facadeName: string;
  bedroom: string;
  bath: string;
  living: string;
  garage: string;
  description: string;
  state: 'NSW' | 'QLD' | 'VIC' | '';
}

interface FileGroup {
  floorPlanFiles: File[];
  sitedFloorPlanFiles: File[];
  areaTableFiles: File[];
  facadeFiles: File[];
  inclusionFiles: File[];
}

const FILE_FIELDS: { key: keyof FileGroup; label: string }[] = [
  { key: 'floorPlanFiles', label: 'Floor Plan' },
  { key: 'sitedFloorPlanFiles', label: 'Sited Floor Plan' },
  { key: 'areaTableFiles', label: 'Area Table' },
  { key: 'facadeFiles', label: 'Facade' },
  { key: 'inclusionFiles', label: 'Inclusions' },
];

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

function FileUploadField({
  label,
  files,
  existingFiles,
  onChange,
  onRemove,
  testId,
}: {
  label: string;
  files: File[];
  existingFiles?: FileMeta[];
  onChange: (files: File[]) => void;
  onRemove: (idx: number) => void;
  testId: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <label className="flex items-center gap-2 border-2 border-dashed border-border rounded-md px-3 py-2 cursor-pointer hover-elevate">
        <Upload className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Upload files</span>
        <input
          type="file"
          multiple
          className="hidden"
          data-testid={testId}
          onChange={(e) => {
            const newFiles = Array.from(e.target.files || []);
            onChange([...files, ...newFiles]);
            e.target.value = '';
          }}
        />
      </label>
      {existingFiles && existingFiles.length > 0 && (
        <ul className="space-y-1">
          {existingFiles.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <a
                href={`/admin/api/files/${f.filename}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary underline underline-offset-2 hover:opacity-80 flex items-center gap-1 min-w-0"
              >
                <Download className="h-3 w-3 shrink-0" />
                <span className="truncate">{f.originalName}</span>
              </a>
              <span className="text-xs text-muted-foreground shrink-0">({Math.round(f.size / 1024)} KB)</span>
            </li>
          ))}
        </ul>
      )}
      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-xs">
              <span className="flex-1 truncate text-foreground">{f.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(i)}
                data-testid={`${testId}-remove-${i}`}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ReadonlyField({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === '') return null;
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

export function AdminPackageUploadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const [files, setFiles] = useState<FileGroup>({
    floorPlanFiles: [],
    sitedFloorPlanFiles: [],
    areaTableFiles: [],
    facadeFiles: [],
    inclusionFiles: [],
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      lotAddress: '',
      landSize: '',
      landPrice: '',
      buildSize: '',
      buildPrice: '',
      totalPackagePrice: '',
      productCategory: 'Actual',
      forecastRegistrationDate: '',
      stageName: '',
      propertyType: 'House and Land',
      floorPlanName: '',
      facadeName: '',
      bedroom: '',
      bath: '',
      living: '',
      garage: '',
      description: '',
      state: '',
    },
  });

  const { data: uploadData, isLoading: loadingUpload } = useQuery<{ success: boolean; upload: PackageUpload }>({
    queryKey: ['/admin/api/package-uploads', id],
    queryFn: () =>
      fetch(`/admin/api/package-uploads/${id}`, { credentials: 'include' }).then(r => r.json()),
    enabled: !!id,
  });

  const upload = uploadData?.upload;

  const { data: prData } = useQuery<{ success: boolean; request: PricingRequest }>({
    queryKey: ['/admin/api/pricing-requests', upload?.pricingRequestId],
    queryFn: () =>
      fetch(`/admin/api/pricing-requests/${upload!.pricingRequestId}`, { credentials: 'include' }).then(r => r.json()),
    enabled: !!upload?.pricingRequestId,
  });

  const pricingRequest = prData?.request;
  const stageNames = pricingRequest?.stages?.map(s => s.stageName) ?? [];

  useEffect(() => {
    if (upload) {
      const land = parseFloat(upload.landPrice || '0') || 0;
      const build = parseFloat(upload.buildPrice || '0') || 0;
      const autoTotal = land > 0 || build > 0 ? String(land + build) : '';
      reset({
        lotAddress: upload.lotAddress || '',
        landSize: upload.landSize || '',
        landPrice: upload.landPrice || '',
        buildSize: upload.buildSize || '',
        buildPrice: upload.buildPrice || '',
        totalPackagePrice: upload.totalPackagePrice || autoTotal,
        productCategory: upload.productCategory || 'Actual',
        forecastRegistrationDate: upload.forecastRegistrationDate || '',
        stageName: upload.stageName || '',
        propertyType: upload.propertyType || 'House and Land',
        floorPlanName: upload.floorPlanName || '',
        facadeName: upload.facadeName || '',
        bedroom: upload.bedroom != null ? String(upload.bedroom) : '',
        bath: upload.bath != null ? String(upload.bath) : '',
        living: upload.living != null ? String(upload.living) : '',
        garage: upload.garage != null ? String(upload.garage) : '',
        description: upload.description || '',
        state: (upload.state as FormValues['state']) || '',
      });
    }
  }, [upload, reset]);

  const watchedLandPrice = watch('landPrice');
  const watchedBuildPrice = watch('buildPrice');
  const watchedTotal = watch('totalPackagePrice');
  const lastAutoTotal = useRef('');

  useEffect(() => {
    const land = parseFloat(watchedLandPrice) || 0;
    const build = parseFloat(watchedBuildPrice) || 0;
    const computed = land > 0 || build > 0 ? String(land + build) : '';
    if (watchedTotal === lastAutoTotal.current || watchedTotal === '') {
      setValue('totalPackagePrice', computed);
    }
    lastAutoTotal.current = computed;
  }, [watchedLandPrice, watchedBuildPrice]);

  const updateFileGroup = (key: keyof FileGroup, newFiles: File[]) => {
    setFiles(prev => ({ ...prev, [key]: newFiles }));
  };

  const removeFile = (key: keyof FileGroup, idx: number) => {
    setFiles(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx),
    }));
  };

  const uploadFileGroup = async (fileList: File[], field: string): Promise<FileMeta[]> => {
    if (fileList.length === 0) return [];
    const formData = new FormData();
    fileList.forEach(f => formData.append('files', f));
    const res = await fetch('/admin/api/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const data = await res.json() as { success: boolean; files: FileMeta[] };
    if (!data.success) throw new Error(`Upload failed for ${field}`);
    return data.files;
  };

  const onSubmit = async (values: FormValues) => {
    if (!id) return;
    setSubmitting(true);
    try {
      const [floorPlanFiles, sitedFloorPlanFiles, areaTableFiles, facadeFiles, inclusionFiles] =
        await Promise.all([
          uploadFileGroup(files.floorPlanFiles, 'floorPlanFiles'),
          uploadFileGroup(files.sitedFloorPlanFiles, 'sitedFloorPlanFiles'),
          uploadFileGroup(files.areaTableFiles, 'areaTableFiles'),
          uploadFileGroup(files.facadeFiles, 'facadeFiles'),
          uploadFileGroup(files.inclusionFiles, 'inclusionFiles'),
        ]);

      const payload: Record<string, unknown> = {
        pricingRequestId: upload?.pricingRequestId || undefined,
        lotAddress: values.lotAddress,
        landSize: values.landSize,
        landPrice: values.landPrice,
        buildSize: values.buildSize || undefined,
        buildPrice: values.buildPrice || undefined,
        totalPackagePrice: values.totalPackagePrice || undefined,
        productCategory: values.productCategory || undefined,
        forecastRegistrationDate: values.forecastRegistrationDate || undefined,
        stageName: values.stageName || undefined,
        propertyType: values.propertyType || undefined,
        floorPlanName: values.floorPlanName || undefined,
        facadeName: values.facadeName || undefined,
        bedroom: values.bedroom ? Number(values.bedroom) : undefined,
        bath: values.bath ? Number(values.bath) : undefined,
        living: values.living ? Number(values.living) : undefined,
        garage: values.garage ? Number(values.garage) : undefined,
        description: values.description || undefined,
        state: values.state || undefined,
        floorPlanFiles: [...(upload?.floorPlanFiles ?? []), ...floorPlanFiles],
        sitedFloorPlanFiles: [...(upload?.sitedFloorPlanFiles ?? []), ...sitedFloorPlanFiles],
        areaTableFiles: [...(upload?.areaTableFiles ?? []), ...areaTableFiles],
        facadeFiles: [...(upload?.facadeFiles ?? []), ...facadeFiles],
        inclusionFiles: [...(upload?.inclusionFiles ?? []), ...inclusionFiles],
      };

      const res = await fetch(`/admin/api/package-uploads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: 'Package saved', description: 'Files uploaded and details saved.' });
        queryClient.invalidateQueries({ queryKey: ['/admin/api/package-uploads'] });
        navigate('/admin/package-uploads');
      } else {
        toast({ title: 'Error', description: data.message || 'Please try again.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUpload) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!upload) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p className="text-muted-foreground">Package not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/package-uploads')}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Upload Package</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{upload.lotAddress}</p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[upload.status]}`}
          data-testid="status-badge"
        >
          {STATUS_LABELS[upload.status] ?? upload.status}
        </span>
      </div>

      {/* Pricing Request Details (read-only) */}
      {pricingRequest && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pricing Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ReadonlyField label="State" value={pricingRequest.state} />
              <ReadonlyField label="Suburb" value={pricingRequest.suburb} />
              <ReadonlyField label="Estate" value={pricingRequest.estate} />
            </div>

            {pricingRequest.stages && pricingRequest.stages.length > 0 && (() => {
              const matchedStages = pricingRequest.stages
                .map(stage => ({
                  ...stage,
                  lots: stage.lots.filter(lot => {
                    if (upload.lotNumber && upload.stageName) {
                      return lot.lotNumber === upload.lotNumber && stage.stageName === upload.stageName;
                    }
                    return (
                      String(lot.landSize).trim() === String(upload.landSize ?? '').trim() &&
                      String(lot.price).trim() === String(upload.landPrice ?? '').trim()
                    );
                  }),
                }))
                .filter(stage => stage.lots.length > 0);

              if (matchedStages.length === 0) return null;

              return (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Stage & Lot</p>
                  {matchedStages.map((stage, si) => (
                    <div key={si} className="rounded-md border p-3 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-sm font-medium text-foreground">Stage {stage.stageName}</p>
                        {stage.registration && (
                          <span className="text-xs text-muted-foreground">Registration: {stage.registration}</span>
                        )}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-1.5 pr-4 text-muted-foreground font-medium">Lot</th>
                              <th className="text-left py-1.5 pr-4 text-muted-foreground font-medium">Land Size</th>
                              <th className="text-left py-1.5 pr-4 text-muted-foreground font-medium">Price</th>
                              <th className="text-left py-1.5 text-muted-foreground font-medium">Floor Plans</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stage.lots.map((lot, li) => (
                              <tr key={li} className="border-b last:border-0">
                                <td className="py-1.5 pr-4 font-medium text-foreground">{lot.lotNumber}</td>
                                <td className="py-1.5 pr-4 text-muted-foreground">{lot.landSize} sqm</td>
                                <td className="py-1.5 pr-4 text-muted-foreground">${lot.price}</td>
                                <td className="py-1.5 text-muted-foreground">{lot.floorPlans.join(', ')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {pricingRequest.additionalCosts && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ReadonlyField label="Land BDM Expense" value={`$${pricingRequest.additionalCosts.landBdmExpense} inc GST`} />
                <ReadonlyField label="Independent Inspection" value={`$${pricingRequest.additionalCosts.independentInspection} inc GST`} />
                {pricingRequest.additionalCosts.additionalMarketing && (
                  <ReadonlyField label="Additional Marketing" value={pricingRequest.additionalCosts.additionalMarketing} />
                )}
              </div>
            )}

          </CardContent>
        </Card>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Package Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Package Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Lot Address <span className="text-destructive">*</span></Label>
                <Input
                  {...register('lotAddress', { required: 'Lot address is required' })}
                  placeholder="e.g. Lot 101, Riverwalk, Werribee"
                  data-testid="input-lot-address"
                />
                {errors.lotAddress && <p className="text-destructive text-sm">{errors.lotAddress.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label>State</Label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <SelectTrigger data-testid="select-state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NSW">NSW</SelectItem>
                        <SelectItem value="QLD">QLD</SelectItem>
                        <SelectItem value="VIC">VIC</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Stage</Label>
                {stageNames.length > 0 ? (
                  <Controller
                    name="stageName"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <SelectTrigger data-testid="select-stage-name">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {stageNames.map(name => (
                            <SelectItem key={name} value={name}>{name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <Input
                    {...register('stageName')}
                    placeholder="e.g. Stage 1"
                    data-testid="input-stage-name"
                  />
                )}
              </div>
              <div className="grid gap-2">
                <Label>Forecast Registration Date</Label>
                <Input
                  {...register('forecastRegistrationDate')}
                  placeholder="e.g. Q3 2025"
                  data-testid="input-forecast-registration-date"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Land Size (sqm) <span className="text-destructive">*</span></Label>
                <Input
                  {...register('landSize', { required: 'Land size is required' })}
                  placeholder="e.g. 450"
                  data-testid="input-land-size"
                />
                {errors.landSize && <p className="text-destructive text-sm">{errors.landSize.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label>Land Price ($) <span className="text-destructive">*</span></Label>
                <Input
                  {...register('landPrice', { required: 'Land price is required' })}
                  placeholder="e.g. 350000"
                  data-testid="input-land-price"
                />
                {errors.landPrice && <p className="text-destructive text-sm">{errors.landPrice.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Build Size</Label>
                <Input
                  {...register('buildSize')}
                  placeholder="e.g. 28sq"
                  data-testid="input-build-size"
                />
              </div>
              <div className="grid gap-2">
                <Label>Build Price ($)</Label>
                <Input
                  {...register('buildPrice')}
                  placeholder="e.g. 280000"
                  data-testid="input-build-price"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Total Package Price ($)</Label>
              <Input
                {...register('totalPackagePrice')}
                placeholder="e.g. 630000"
                data-testid="input-total-package-price"
              />
              <p className="text-xs text-muted-foreground">Auto-calculated from Land Price + Build Price. Edit to override.</p>
            </div>
            <div className="grid gap-2">
              <Label>Product Category</Label>
              <Controller
                name="productCategory"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || 'Actual'}>
                    <SelectTrigger data-testid="select-product-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Actual">Actual</SelectItem>
                      <SelectItem value="Pre-release">Pre-release</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Property Type</Label>
              <Controller
                name="propertyType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || 'House and Land'}>
                    <SelectTrigger data-testid="select-property-type">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="House and Land">House and Land</SelectItem>
                      <SelectItem value="House Only">House Only</SelectItem>
                      <SelectItem value="Duplex">Duplex</SelectItem>
                      <SelectItem value="Dual Key">Dual Key</SelectItem>
                      <SelectItem value="Single Contract">Single Contract</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Floor Plan Name</Label>
                <Input
                  {...register('floorPlanName')}
                  placeholder="e.g. Harmony 28"
                  data-testid="input-floor-plan-name"
                />
              </div>
              <div className="grid gap-2">
                <Label>Facade Name</Label>
                <Input
                  {...register('facadeName')}
                  placeholder="e.g. Coastal"
                  data-testid="input-facade-name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label>Bedroom</Label>
                <Input
                  {...register('bedroom')}
                  type="number"
                  min="0"
                  placeholder="e.g. 4"
                  data-testid="input-bedroom"
                />
              </div>
              <div className="grid gap-2">
                <Label>Bath</Label>
                <Input
                  {...register('bath')}
                  type="number"
                  min="0"
                  placeholder="e.g. 2"
                  data-testid="input-bath"
                />
              </div>
              <div className="grid gap-2">
                <Label>Living</Label>
                <Input
                  {...register('living')}
                  type="number"
                  min="0"
                  placeholder="e.g. 2"
                  data-testid="input-living"
                />
              </div>
              <div className="grid gap-2">
                <Label>Garage</Label>
                <Input
                  {...register('garage')}
                  type="number"
                  min="0"
                  placeholder="e.g. 2"
                  data-testid="input-garage"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                {...register('description')}
                placeholder="Enter a description of the property..."
                rows={4}
                data-testid="input-description"
              />
            </div>
          </CardContent>
        </Card>

        {/* File Uploads */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">File Uploads</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FILE_FIELDS.map(({ key, label }) => (
              <FileUploadField
                key={key}
                label={label}
                files={files[key]}
                existingFiles={upload?.[key as keyof typeof upload] as FileMeta[] | undefined}
                onChange={(newFiles) => updateFileGroup(key, newFiles)}
                onRemove={(idx) => removeFile(key, idx)}
                testId={`input-${key}`}
              />
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/package-uploads')}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} data-testid="button-submit-package">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? 'Saving...' : 'Save & Submit'}
          </Button>
        </div>
      </form>

      {/* Pricing Request Links & Files */}
      {pricingRequest && (
        (pricingRequest.landLinks && pricingRequest.landLinks.length > 0) ||
        (pricingRequest.attachments && pricingRequest.attachments.length > 0)
      ) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pricing Request Links & Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pricingRequest!.landLinks && pricingRequest!.landLinks.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Land Links</p>
                <ul className="space-y-1">
                  {pricingRequest!.landLinks.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary underline underline-offset-2 hover:opacity-80 break-all"
                        data-testid={`link-land-${i}`}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pricingRequest!.attachments && pricingRequest!.attachments.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Attachments</p>
                <ul className="space-y-1">
                  {pricingRequest!.attachments.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <a
                        href={`/admin/api/files/${f.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary underline underline-offset-2 hover:opacity-80 flex items-center gap-1.5 min-w-0"
                        data-testid={`link-pricing-attachment-${i}`}
                      >
                        <Download className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{f.originalName}</span>
                      </a>
                      <span className="text-xs text-muted-foreground shrink-0">({Math.round(f.size / 1024)} KB)</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
