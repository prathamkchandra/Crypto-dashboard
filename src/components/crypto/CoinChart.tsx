'use client';

import { useState, useEffect, useTransition } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getMarketChart } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { format, fromUnixTime } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Skeleton } from '@/components/ui/skeleton';

interface CoinChartProps {
  coinId: string;
}

const timeRanges = [
  { label: '24H', value: 1 },
  { label: '7D', value: 7 },
  { label: '30D', value: 30 },
  { label: '90D', value: 90 },
];

export function CoinChart({ coinId }: CoinChartProps) {
  const [data, setData] = useState<{ date: string; price: number }[]>([]);
  const [days, setDays] = useState<number>(1);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    startTransition(async () => {
      const result = await getMarketChart(coinId, days);
      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Chart Error',
          description: result.error,
        });
        setData([]);
      } else {
        const formattedData = result.prices.map(price => ({
          date: fromUnixTime(price[0] / 1000).toISOString(),
          price: price[1],
        }));
        setData(formattedData);
      }
    });
  }, [coinId, days, toast]);

  const handleTimeRangeChange = (value: string) => {
    if (value) {
      setDays(Number(value));
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">
                {format(new Date(label), 'MMM d, yyyy h:mm a')}
              </span>
              <span className="font-bold">
                {formatCurrency(payload[0].value)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <div className="flex justify-end mb-4">
        <ToggleGroup
          type="single"
          defaultValue={days.toString()}
          onValueChange={handleTimeRangeChange}
          aria-label="Chart time range"
          size="sm"
        >
          {timeRanges.map(range => (
            <ToggleGroupItem key={range.value} value={range.value.toString()} disabled={isPending}>
              {range.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      {isPending ? (
         <Skeleton className="h-full w-full" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), days === 1 ? 'h:mm a' : 'MMM d')}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                domain={['dataMin', 'dataMax']}
                tickFormatter={(price) => formatCurrency(price, { notation: 'compact' })}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                orientation="right"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
            </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
