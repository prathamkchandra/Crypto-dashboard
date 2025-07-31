'use client';

import { useEffect, useState } from 'react';
import { useWatchlist } from '@/hooks/use-watchlist';
import { getMarkets } from '@/lib/actions';
import { CoinTable } from '@/components/crypto/CoinTable';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { CoinMarket } from '@/lib/types';
import { Star, AlertTriangle } from 'lucide-react';

export default function WatchlistPage() {
  const { watchlist, toggleWatchlist, isInitialized } = useWatchlist();
  const [watchedCoins, setWatchedCoins] = useState<CoinMarket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isInitialized) return;

    if (watchlist.length === 0) {
      setIsLoading(false);
      setWatchedCoins([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    getMarkets(1, watchlist)
      .then(result => {
        if ('error' in result) {
          setError(result.error);
        } else {
          setWatchedCoins(result);
        }
      })
      .catch(() => {
        setError('An unexpected error occurred.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [watchlist, isInitialized]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Your Watchlist</h1>
      {error && (
         <Alert variant="destructive" className="max-w-2xl mx-auto mb-6">
           <AlertTriangle className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {isInitialized && watchlist.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Your watchlist is empty</h2>
            <p className="text-muted-foreground mt-2">Add coins from the markets page to see them here.</p>
        </div>
      )}

      <CoinTable
        coins={watchedCoins}
        isLoading={isLoading || !isInitialized}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
      />
    </div>
  );
}
