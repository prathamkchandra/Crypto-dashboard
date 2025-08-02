'use client';

import Image from 'next/image';
import { Star, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { useWatchlist } from '@/hooks/use-watchlist';
import type { CoinDetails } from '@/lib/types';
import { formatCurrency, formatLargeNumber, formatPercentage } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CoinChart } from './CoinChart';

interface CoinDetailViewProps {
  coin: CoinDetails;
}

export function CoinDetailView({ coin }: CoinDetailViewProps) {
  const { watchlist, toggleWatchlist, isInitialized } = useWatchlist();

  const infoItems = [
    { label: 'Market Cap Rank', value: `#${coin.market_data.market_cap_rank}` },
    { label: 'Market Cap', value: formatLargeNumber(coin.market_data.market_cap.usd) },
    { label: '24h Trading Vol', value: formatLargeNumber(coin.market_data.total_volume.usd) },
    { label: 'Circulating Supply', value: coin.market_data.circulating_supply.toLocaleString() },
    { label: 'Total Supply', value: coin.market_data.total_supply?.toLocaleString() ?? 'N/A' },
    { label: 'Max Supply', value: coin.market_data.max_supply?.toLocaleString() ?? '∞' },
  ];

  const createMarkup = () => {
    return { __html: coin.description.en.replace(/<a href/g, '<a target="_blank" rel="noopener noreferrer" href') };
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Image src={coin.image.large} alt={coin.name} width={64} height={64} data-ai-hint="coin icon"/>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">{coin.name}</h1>
            <p className="text-xl text-muted-foreground uppercase">{coin.symbol}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex flex-col items-end flex-grow">
            <p className="text-3xl font-bold">{formatCurrency(coin.market_data.current_price.usd)}</p>
            <p className={`text-lg font-semibold ${coin.market_data.price_change_percentage_24h < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {formatPercentage(coin.market_data.price_change_percentage_24h)} (24h)
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggleWatchlist(coin.id)}
            disabled={!isInitialized}
            aria-label="Toggle Watchlist"
            className="shrink-0"
          >
            <Star className={`h-5 w-5 ${watchlist.includes(coin.id) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <CoinChart coinId={coin.id} />
            </CardContent>
          </Card>
          {coin.description.en && (
            <Card className="mt-6">
              <CardHeader><CardTitle>About {coin.name}</CardTitle></CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={createMarkup()} />
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader><CardTitle>Market Stats</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {infoItems.map(item => (
                  <li key={item.label} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-right">{item.value}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
