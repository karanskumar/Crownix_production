import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FileMeta, PackageUpload, PricingRequest } from '@shared/schema';

interface FormValues {
  pricingRequestId?: string;
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
  packageFiles: File[];
}

interface UploadedFileGroup {
  floorPlanFiles: FileMeta[];
  sitedFloorPlanFiles: FileMeta[];
  areaTableFiles: FileMeta[];
  facadeFiles: FileMeta[];
  inclusionFiles: FileMeta[];
  packageFiles: FileMeta[];
}

const FILE_FIELDS: { key: keyof FileGroup; label: string }[] = [
  { key: 'floorPlanFiles', label: 'Floor Plan' },
  { key: 'sitedFloorPlanFiles', label: 'Sited Floor Plan' },
  { key: 'areaTableFiles', label: 'Area Table' },
  { key: 'facadeFiles', label: 'Facade' },
  { key: 'inclusionFiles', label: 'Inclusions' },
  { key: 'packageFiles', label: 'Package Upload' },
];

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
            <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="truncate">{f.originalName}</span>
              <span className="text-xs opacity-60">({(f.size / 1024 / 1024).toFixed(1)} MB)</span>
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

export function AdminPackageUploadFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const isEditing = !!id;

  const pricingRequestId = searchParams.get('pricingRequestId');
  const duplicateFrom = searchParams.get('duplicateFrom');

  const [files, setFiles] = useState<FileGroup>({
    floorPlanFiles: [],
    sitedFloorPlanFiles: [],
    areaTableFiles: [],
    facadeFiles: [],
    inclusionFiles: [],
    packageFiles: [],
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
      pricingRequestId: pricingRequestId || undefined,
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

  const { data: existingData, isLoading: loadingExisting } = useQuery<{ success: boolean; upload: PackageUpload }>({
    queryKey: ['/admin/api/package-uploads', id],
    queryFn: () =>
      fetch(`/admin/api/package-uploads/${id}`, { credentials: 'include' }).then(r => r.json()),
    enabled: isEditing,
  });

  // Effective pricing request ID: from URL param (new/duplicate) or from loaded upload (edit)
  const effectivePricingRequestId = pricingRequestId || existingData?.upload?.pricingRequestId;

  const { data: pricingData } = useQuery<{ success: boolean; request: PricingRequest }>({
    queryKey: ['/admin/api/pricing-requests', effectivePricingRequestId],
    queryFn: () =>
      fetch(`/admin/api/pricing-requests/${effectivePricingRequestId}`, { credentials: 'include' }).then(r => r.json()),
    enabled: !!effectivePricingRequestId,
  });

  const { data: duplicateData } = useQuery<{ success: boolean; upload: PackageUpload }>({
    queryKey: ['/admin/api/package-uploads', duplicateFrom],
    queryFn: () =>
      fetch(`/admin/api/package-uploads/${duplicateFrom}`, { credentials: 'include' }).then(r => r.json()),
    enabled: !!duplicateFrom,
  });

  useEffect(() => {
    if (isEditing && existingData?.upload) {
      const u = existingData.upload;
      const land = parseFloat(u.landPrice || '0') || 0;
      const build = parseFloat(u.buildPrice || '0') || 0;
      const autoTotal = land > 0 || build > 0 ? String(land + build) : '';
      reset({
        pricingRequestId: u.pricingRequestId,
        lotAddress: u.lotAddress || '',
        landSize: u.landSize || '',
        landPrice: u.landPrice || '',
        buildSize: u.buildSize || '',
        buildPrice: u.buildPrice || '',
        totalPackagePrice: u.totalPackagePrice || autoTotal,
        productCategory: u.productCategory || 'Actual',
        forecastRegistrationDate: u.forecastRegistrationDate || '',
        stageName: u.stageName || '',
        propertyType: u.propertyType || 'House and Land',
        floorPlanName: u.floorPlanName || '',
        facadeName: u.facadeName || '',
        bedroom: u.bedroom != null ? String(u.bedroom) : '',
        bath: u.bath != null ? String(u.bath) : '',
        living: u.living != null ? String(u.living) : '',
        garage: u.garage != null ? String(u.garage) : '',
        description: u.description || '',
        state: u.state || '',
      });
    }
  }, [existingData, isEditing, reset]);

  useEffect(() => {
    // Only prefill from pricing request in new-from-pricing-request flow, not in edit mode
    if (!isEditing && pricingData?.request) {
      const r = pricingData.request;
      const firstStage = r.stages?.[0];
      const firstLot = firstStage?.lots?.[0];
      const land = parseFloat(firstLot?.price || '0') || 0;
      reset({
        pricingRequestId: r.id,
        lotAddress: firstLot ? `Lot ${firstLot.lotNumber}, ${r.estate}, ${r.suburb}` : '',
        landSize: firstLot?.landSize || '',
        landPrice: firstLot?.price || '',
        buildSize: '',
        buildPrice: '',
        totalPackagePrice: land > 0 ? String(land) : '',
        productCategory: 'Actual',
        forecastRegistrationDate: firstStage?.registration || '',
        stageName: firstStage?.stageName || '',
        propertyType: 'House and Land',
        floorPlanName: firstLot?.floorPlans?.[0] || '',
        facadeName: '',
        bedroom: '',
        bath: '',
        living: '',
        garage: '',
        description: '',
        state: r.state || '',
      });
    }
  }, [pricingData, isEditing, reset]);

  useEffect(() => {
    if (duplicateData?.upload) {
      const u = duplicateData.upload;
      const land = parseFloat(u.landPrice || '0') || 0;
      const build = parseFloat(u.buildPrice || '0') || 0;
      const autoTotal = land > 0 || build > 0 ? String(land + build) : '';
      reset({
        pricingRequestId: u.pricingRequestId,
        lotAddress: u.lotAddress || '',
        landSize: u.landSize || '',
        landPrice: u.landPrice || '',
        buildSize: u.buildSize || '',
        buildPrice: u.buildPrice || '',
        totalPackagePrice: u.totalPackagePrice || autoTotal,
        productCategory: u.productCategory || 'Actual',
        forecastRegistrationDate: u.forecastRegistrationDate || '',
        stageName: u.stageName || '',
        propertyType: u.propertyType || 'House and Land',
        floorPlanName: u.floorPlanName || '',
        facadeName: u.facadeName || '',
        bedroom: u.bedroom != null ? String(u.bedroom) : '',
        bath: u.bath != null ? String(u.bath) : '',
        living: u.living != null ? String(u.living) : '',
        garage: u.garage != null ? String(u.garage) : '',
        description: u.description || '',
        state: u.state || '',
      });
    }
  }, [duplicateData, reset]);

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
    setSubmitting(true);
    try {
      const [floorPlanFiles, sitedFloorPlanFiles, areaTableFiles, facadeFiles, inclusionFiles, packageFiles] =
        await Promise.all([
          uploadFileGroup(files.floorPlanFiles, 'floorPlanFiles'),
          uploadFileGroup(files.sitedFloorPlanFiles, 'sitedFloorPlanFiles'),
          uploadFileGroup(files.areaTableFiles, 'areaTableFiles'),
          uploadFileGroup(files.facadeFiles, 'facadeFiles'),
          uploadFileGroup(files.inclusionFiles, 'inclusionFiles'),
          uploadFileGroup(files.packageFiles, 'packageFiles'),
        ]);

      const existing = existingData?.upload;
      const payload: Record<string, unknown> = {
        pricingRequestId: values.pricingRequestId || undefined,
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
        floorPlanFiles: [...(existing?.floorPlanFiles ?? []), ...floorPlanFiles],
        sitedFloorPlanFiles: [...(existing?.sitedFloorPlanFiles ?? []), ...sitedFloorPlanFiles],
        areaTableFiles: [...(existing?.areaTableFiles ?? []), ...areaTableFiles],
        facadeFiles: [...(existing?.facadeFiles ?? []), ...facadeFiles],
        inclusionFiles: [...(existing?.inclusionFiles ?? []), ...inclusionFiles],
        packageFiles: [...(existing?.packageFiles ?? []), ...packageFiles],
      };

      const url = isEditing
        ? `/admin/api/package-uploads/${id}`
        : '/admin/api/package-uploads';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: isEditing ? 'Package updated' : 'Package submitted',
          description: isEditing ? 'Changes saved.' : 'Notification emails sent.',
        });
        navigate('/admin/package-uploads');
      } else {
        toast({ title: 'Error', description: data.message || 'Please try again.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingExisting) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const existing = existingData?.upload;
  const pricingRequest = pricingData?.request;
  const stageNames = pricingRequest?.stages?.map(s => s.stageName) ?? [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {isEditing ? 'Edit Package Upload' : duplicateFrom ? 'Duplicate Package Upload' : 'New Package Upload'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isEditing ? 'Update the package details' : 'Create a new package upload'}
        </p>
      </div>

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
                existingFiles={existing?.[key as keyof typeof existing] as FileMeta[] | undefined}
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
            {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Submit Package'}
          </Button>
        </div>
      </form>
    </div>
  );
}
