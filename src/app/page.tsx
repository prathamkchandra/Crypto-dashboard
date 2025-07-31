import { getMarkets } from '@/lib/actions';
import { MarketsView } from '@/components/crypto/MarketsView';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Markets',
};

export default async function HomePage() {
  const initialData = await getMarkets(1);

  if ('error' in initialData) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Fetching Data</AlertTitle>
          <AlertDescription>
            {initialData.error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return <MarketsView initialData={initialData} />;
}
