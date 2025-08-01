'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../ui/table';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { cn, formatCurrency, formatLargeNumber, formatPercentage } from '../../lib/utils';
import type { CoinMarket } from '../../lib/types';

interface CoinTableProps {
  coins: CoinMarket[];
  isLoading: boolean;
  watchlist: string[];
  onToggleWatchlist: (coinId: string) => void;
}

export function CoinTable({ coins, isLoading, watchlist, onToggleWatchlist }: CoinTableProps) {
  
  const renderPriceChange = (priceChange: number) => {
    const isNegative = priceChange < 0;
    const Icon = isNegative ? ChevronDown : ChevronUp;
    return (
      <span className={cn('flex items-center', isNegative ? 'text-red-500' : 'text-green-500')}>
        <Icon className="h-4 w-4 mr-1" />
        {formatPercentage(Math.abs(priceChange))}
      </span>
    );
  };
  
  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-5 w-5" /></TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
      <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
      <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-28" /></TableCell>
      <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-28" /></TableCell>
    </TableRow>
  );

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="w-[60px]">#</TableHead>
            <TableHead>Coin</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="hidden sm:table-cell">24h %</TableHead>
            <TableHead className="hidden lg:table-cell">Market Cap</TableHead>
            <TableHead className="hidden lg:table-cell">Volume (24h)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
          ) : coins.length > 0 ? (
            coins.map((coin) => (
              <TableRow key={coin.id}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleWatchlist(coin.id)}
                    aria-label={`Toggle ${coin.name} in watchlist`}
                  >
                    <Star
                      className={cn(
                        'h-5 w-5 transition-colors',
                        watchlist.includes(coin.id)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      )}
                    />
                  </Button>
                </TableCell>
                <TableCell className="text-muted-foreground">{coin.market_cap_rank}</TableCell>
                <TableCell className="font-medium">
                  <Link href={`/coin/${coin.id}`} className="hover:underline">
                    <div className="flex item-center gap-3">
                      <Image src={coin.image} alt={coin.name} width={32} height={32} className="rounded-full" data-ai-hint="coin icon" />
                      <div className="flex flex-col">
                        <span>{coin.name}</span>
                        <span className="text-muted-foreground text-xs uppercase">{coin.symbol}</span>
                      </div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>{formatCurrency(coin.current_price)}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {renderPriceChange(coin.price_change_percentage_24h)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">{formatLargeNumber(coin.market_cap)}</TableCell>
                <TableCell className="hidden lg:table-cell">{formatLargeNumber(coin.total_volume)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
