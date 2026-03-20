import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export function AdminActiveDealPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Active Deals</h1>
        <p className="text-muted-foreground mt-1">View and manage active deals across all states</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-md bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-base">Active Deals</CardTitle>
          </div>
          <CardDescription>This section is coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            The Active Deals portal will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
