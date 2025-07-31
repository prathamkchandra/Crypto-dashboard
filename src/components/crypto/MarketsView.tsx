'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CoinTable } from './CoinTable';
import { useDebounce } from '@/hooks/use-debounce';
import { useWatchlist } from '@/hooks/use-watchlist';
import { getMarkets } from '@/lib/actions';
import type { CoinMarket } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

interface MarketsViewProps {
  initialData: CoinMarket[];
}

export function MarketsView({ initialData }: MarketsViewProps) {
  const [coins, setCoins] = useState<CoinMarket[]>(initialData);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { watchlist, toggleWatchlist, isInitialized } = useWatchlist();
  const { toast } = useToast();

  const filteredCoins = useMemo(() => {
    if (!debouncedSearchTerm) return coins;
    return coins.filter(coin =>
      coin.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [coins, debouncedSearchTerm]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    setIsLoading(true);
    startTransition(async () => {
      const result = await getMarkets(newPage);
      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Error fetching data',
          description: result.error,
        });
        setCoins([]);
      } else {
        setCoins(result);
        setSearchTerm('');
      }
      setIsLoading(false);
      window.scrollTo(0, 0);
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Top Cryptocurrency Markets</h1>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search coins..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <CoinTable
        coins={filteredCoins}
        isLoading={isLoading || isPending || !isInitialized}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
      />

      <div className="flex justify-center items-center gap-4 mt-6">
        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1 || isLoading || isPending}>
          Previous
        </Button>
        <span className="text-sm font-medium">Page {page}</span>
        <Button onClick={() => handlePageChange(page + 1)} disabled={isLoading || isPending}>
          Next
        </Button>
      </div>
    </div>
  );
}
