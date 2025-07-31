import { getCoinDetails } from '@/lib/actions';
import { CoinDetailView } from '@/components/crypto/CoinDetailView';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const id = params.id;
  const data = await getCoinDetails(id);
  
  if ('error' in data) {
    return {
      title: 'Error',
      description: `Failed to load data for coin ${id}.`,
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: data.name,
    description: `Live price, chart, and market data for ${data.name} (${data.symbol.toUpperCase()}).`,
    openGraph: {
      images: [data.image.large, ...previousImages],
    },
  };
}


export default async function CoinDetailPage({ params }: Props) {
  const data = await getCoinDetails(params.id);

  if ('error' in data) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not load data for '{params.id}'. {data.error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <CoinDetailView coin={data} />;
}
