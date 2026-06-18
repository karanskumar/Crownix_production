import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm, useFieldArray, useFormContext, FormProvider, Controller } from 'react-hook-form';
import type { ArrayPath } from 'react-hook-form';
import type { FileMeta } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Loader2, Upload, X, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FloorPlanField {
  value: string;
}

interface LotField {
  lotNumber: string;
  landSize: string;
  price: string;
  floorPlans: FloorPlanField[];
}

interface StageField {
  stageName: string;
  registration: string;
  lots: LotField[];
}

interface FormValues {
  state: 'NSW' | 'QLD' | 'VIC' | '';
  suburb: string;
  estate: string;
  stages: StageField[];
  additionalCosts: {
    landBdmExpense: string;
    independentInspection: string;
    duplexComms: string;
    additionalMarketing: string;
  };
  landLinks: { value: string }[];
}

function LotSection({ stageIdx, lotIdx, canRemove, onRemove }: {
  stageIdx: number;
  lotIdx: number;
  canRemove: boolean;
  onRemove: () => void;
}) {
  const { register, control } = useFormContext<FormValues>();
  const {
    fields: fpFields,
    append: appendFp,
    remove: removeFp,
  } = useFieldArray({ control, name: `stages.${stageIdx}.lots.${lotIdx}.floorPlans` as ArrayPath<FormValues> });

  return (
    <div className="bg-muted/30 rounded-md p-3 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">Lot {lotIdx + 1}</span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            data-testid={`button-remove-lot-${stageIdx}-${lotIdx}`}
          >
            <X className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="grid gap-1.5">
          <Label className="text-xs">Lot Number <span className="text-destructive">*</span></Label>
          <Input
            {...register(`stages.${stageIdx}.lots.${lotIdx}.lotNumber` as const, { required: true })}
            placeholder="e.g. 101"
            data-testid={`input-lot-number-${stageIdx}-${lotIdx}`}
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs">Land Size (sqm) <span className="text-destructive">*</span></Label>
          <Input
            {...register(`stages.${stageIdx}.lots.${lotIdx}.landSize` as const, { required: true })}
            placeholder="e.g. 450"
            data-testid={`input-lot-land-size-${stageIdx}-${lotIdx}`}
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs">Price ($) <span className="text-destructive">*</span></Label>
          <Input
            {...register(`stages.${stageIdx}.lots.${lotIdx}.price` as const, { required: true })}
            placeholder="e.g. 350000"
            data-testid={`input-lot-price-${stageIdx}-${lotIdx}`}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-xs">Floor Plans <span className="text-destructive">*</span></Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => appendFp({ value: '' })}
            data-testid={`button-add-floorplan-${stageIdx}-${lotIdx}`}
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
        {fpFields.map((fp, fpIdx) => (
          <div key={fp.id} className="flex gap-2 items-center">
            <Input
              {...register(`stages.${stageIdx}.lots.${lotIdx}.floorPlans.${fpIdx}.value` as const, { required: true })}
              placeholder="Floor plan name"
              data-testid={`input-floorplan-${stageIdx}-${lotIdx}-${fpIdx}`}
            />
            {fpFields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFp(fpIdx)}
                data-testid={`button-remove-floorplan-${stageIdx}-${lotIdx}-${fpIdx}`}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StageSection({ stageIdx, canRemove, onRemove }: {
  stageIdx: number;
  canRemove: boolean;
  onRemove: () => void;
}) {
  const { register, control } = useFormContext<FormValues>();
  const {
    fields: lotFields,
    append: appendLot,
    remove: removeLot,
  } = useFieldArray({ control, name: `stages.${stageIdx}.lots` as ArrayPath<FormValues> });

  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="font-medium text-foreground">Stage</h3>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            data-testid={`button-remove-stage-${stageIdx}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Stage Name <span className="text-destructive">*</span></Label>
          <Input
            {...register(`stages.${stageIdx}.stageName` as const, { required: 'Stage name is required' })}
            placeholder="e.g. Stage 1"
            data-testid={`input-stage-name-${stageIdx}`}
          />
        </div>
        <div className="grid gap-2">
          <Label>Registration</Label>
          <Input
            {...register(`stages.${stageIdx}.registration` as const)}
            placeholder="e.g. Q3 2025"
            data-testid={`input-stage-registration-${stageIdx}`}
          />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Label>Lots</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendLot({ lotNumber: '', landSize: '', price: '', floorPlans: [{ value: '' }] })}
            data-testid={`button-add-lot-${stageIdx}`}
          >
            <Plus className="h-4 w-4" />
            Add Lot
          </Button>
        </div>
        {lotFields.map((lot, lotIdx) => (
          <LotSection
            key={lot.id}
            stageIdx={stageIdx}
            lotIdx={lotIdx}
            canRemove={lotFields.length > 1}
            onRemove={() => removeLot(lotIdx)}
          />
        ))}
      </div>
    </div>
  );
}

export function AdminPricingRequestPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  // Gate access: only admin role may see or use this page.
  // AdminLayout already fetched /admin/api/me so this hits the cache immediately.
  const { data: meData, isLoading: roleLoading } = useQuery<{ success: boolean; user: { role: string } }>({
    queryKey: ['/admin/api/me'],
    queryFn: () => fetch('/admin/api/me', { credentials: 'include' }).then(r => r.json()),
  });

  const userRole = meData?.user?.role;

  useEffect(() => {
    if (!roleLoading && userRole && userRole !== 'admin') {
      navigate('/admin');
    }
  }, [roleLoading, userRole, navigate]);

  // Don't render the form until we've confirmed admin role
  if (roleLoading || !userRole || userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const methods = useForm<FormValues>({
    defaultValues: {
      state: '',
      suburb: '',
      estate: '',
      stages: [
        {
          stageName: '',
          registration: '',
          lots: [
            { lotNumber: '', landSize: '', price: '', floorPlans: [{ value: '' }] },
          ],
        },
      ],
      additionalCosts: {
        landBdmExpense: '2500',
        independentInspection: '1200',
        duplexComms: '11000',
        additionalMarketing: '',
      },
      landLinks: [],
    },
  });

  const { register, control, handleSubmit, formState: { errors } } = methods;

  const {
    fields: stageFields,
    append: appendStage,
    remove: removeStage,
  } = useFieldArray({ control, name: 'stages' });

  const {
    fields: landLinkFields,
    append: appendLandLink,
    remove: removeLandLink,
  } = useFieldArray({ control, name: 'landLinks' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = attachments.length + files.length;
    if (total > 10) {
      toast({ title: 'Too many files', description: 'Maximum 10 files allowed.', variant: 'destructive' });
      return;
    }
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (idx: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  const uploadAttachments = async (): Promise<FileMeta[]> => {
    if (attachments.length === 0) return [];
    const formData = new FormData();
    attachments.forEach(f => formData.append('files', f));
    const res = await fetch('/admin/api/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const data = await res.json() as { success: boolean; files: FileMeta[] };
    if (!data.success) throw new Error('File upload failed');
    return data.files;
  };

  const onSubmit = async (values: FormValues) => {
    if (!values.state) {
      toast({ title: 'State required', description: 'Please select a state.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      let attachmentMeta: FileMeta[] = [];
      if (attachments.length > 0) {
        attachmentMeta = await uploadAttachments();
      }

      const payload = {
        state: values.state,
        suburb: values.suburb,
        estate: values.estate,
        stages: values.stages.map(stage => ({
          stageName: stage.stageName,
          registration: stage.registration || undefined,
          lots: stage.lots.map(lot => ({
            lotNumber: lot.lotNumber,
            landSize: lot.landSize,
            price: lot.price,
            floorPlans: lot.floorPlans.map(fp => fp.value).filter(Boolean),
          })),
        })),
        additionalCosts: {
          landBdmExpense: values.additionalCosts.landBdmExpense,
          independentInspection: values.additionalCosts.independentInspection,
          duplexComms: values.additionalCosts.duplexComms,
          additionalMarketing: values.additionalCosts.additionalMarketing || undefined,
        },
        landLinks: values.landLinks.map(l => l.value).filter(Boolean),
        attachments: attachmentMeta,
      };

      const res = await fetch('/admin/api/pricing-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: 'Pricing request submitted', description: 'The state team has been notified.' });
        navigate('/admin/package-uploads');
      } else {
        toast({ title: 'Submission failed', description: data.message || 'Please try again.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">New Pricing Request</h1>
        <p className="text-muted-foreground mt-1">Submit a pricing request for a new estate</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Estate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
                  <Controller
                    name="state"
                    control={control}
                    rules={{ required: 'State is required' }}
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
                  {errors.state && <p className="text-destructive text-sm">{errors.state.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="suburb">Suburb <span className="text-destructive">*</span></Label>
                  <Input
                    id="suburb"
                    {...register('suburb', { required: 'Suburb is required' })}
                    placeholder="e.g. Werribee"
                    data-testid="input-suburb"
                  />
                  {errors.suburb && <p className="text-destructive text-sm">{errors.suburb.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="estate">Estate <span className="text-destructive">*</span></Label>
                  <Input
                    id="estate"
                    {...register('estate', { required: 'Estate is required' })}
                    placeholder="e.g. Riverwalk"
                    data-testid="input-estate"
                  />
                  {errors.estate && <p className="text-destructive text-sm">{errors.estate.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stages */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <CardTitle className="text-base">Stages & Lots</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendStage({ stageName: '', registration: '', lots: [{ lotNumber: '', landSize: '', price: '', floorPlans: [{ value: '' }] }] })}
                  data-testid="button-add-stage"
                >
                  <Plus className="h-4 w-4" />
                  Add Stage
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {stageFields.map((stage, stageIdx) => (
                <StageSection
                  key={stage.id}
                  stageIdx={stageIdx}
                  canRemove={stageFields.length > 1}
                  onRemove={() => removeStage(stageIdx)}
                />
              ))}
            </CardContent>
          </Card>

          {/* Additional Costs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Additional Costs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Land BDM Expense ($ inc GST)</Label>
                  <Input
                    {...register('additionalCosts.landBdmExpense')}
                    placeholder="2500"
                    data-testid="input-land-bdm"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Independent Inspection ($ inc GST)</Label>
                  <Input
                    {...register('additionalCosts.independentInspection')}
                    placeholder="1200"
                    data-testid="input-inspection"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Duplex Comms ($ inc GST)</Label>
                  <Input
                    {...register('additionalCosts.duplexComms')}
                    placeholder="11000"
                    data-testid="input-duplex-comms"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Additional Marketing Costs</Label>
                  <Input
                    {...register('additionalCosts.additionalMarketing')}
                    placeholder="e.g. 500"
                    data-testid="input-marketing"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Land Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Land Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Label>Land URLs</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendLandLink({ value: '' })}
                    data-testid="button-add-link"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Add URL
                  </Button>
                </div>
                {landLinkFields.map((link, idx) => (
                  <div key={link.id} className="flex gap-2 items-center">
                    <Input
                      {...register(`landLinks.${idx}.value` as const)}
                      placeholder="https://..."
                      data-testid={`input-land-link-${idx}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLandLink(idx)}
                      data-testid={`button-remove-link-${idx}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {landLinkFields.length === 0 && (
                  <p className="text-sm text-muted-foreground">No URLs added yet.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Attachments (up to 10 files, 100 MB each)</Label>
                <label className="flex items-center gap-2 border-2 border-dashed border-border rounded-md p-4 cursor-pointer hover-elevate">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload files</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    data-testid="input-attachments"
                  />
                </label>
                {attachments.length > 0 && (
                  <ul className="space-y-1">
                    {attachments.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 truncate text-foreground">{f.name}</span>
                        <span className="text-muted-foreground shrink-0">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAttachment(idx)}
                          data-testid={`button-remove-attachment-${idx}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/admin')} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} data-testid="button-submit-pricing">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Submitting...' : 'Submit Pricing Request'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
