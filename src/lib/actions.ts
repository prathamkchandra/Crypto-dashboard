'use server';

import type { CoinMarket, CoinDetails, MarketChart } from './types';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.COINGECKO_API_KEY;

const headers = API_KEY ? { 'x-cg-demo-api-key': API_KEY } : {};

async function handleResponse<T>(response: Response): Promise<T | { error: string }> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response.' }));
    console.error('API Error:', errorData);
    return { error: errorData?.status?.error_message || `HTTP error! status: ${response.status}` };
  }
  return response.json() as Promise<T>;
}

export async function getMarkets(page: number = 1, ids?: string[]): Promise<CoinMarket[] | { error: string }> {
  if (!API_KEY) {
    return { error: "API key is missing. Please create a .env.local file and set COINGECKO_API_KEY." };
  }

  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: '50',
    page: page.toString(),
    sparkline: 'false',
    price_change_percentage: '24h',
  });

  if (ids && ids.length > 0) {
    params.set('ids', ids.join(','));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/coins/markets?${params.toString()}`, { headers, next: { revalidate: 60 } });
    return handleResponse<CoinMarket[]>(response);
  } catch (error) {
    console.error('Fetch Error:', error);
    return { error: 'An unexpected network error occurred.' };
  }
}

export async function getCoinDetails(id: string): Promise<CoinDetails | { error: string }> {
  if (!API_KEY) {
    return { error: "API key is missing." };
  }
  try {
    const response = await fetch(`${API_BASE_URL}/coins/${id}`, { headers, next: { revalidate: 300 } });
    return handleResponse<CoinDetails>(response);
  } catch (error) {
    console.error('Fetch Error:', error);
    return { error: 'An unexpected network error occurred.' };
  }
}

export async function getMarketChart(id: string, days: number = 1): Promise<MarketChart | { error: string }> {
  if (!API_KEY) {
    return { error: "API key is missing." };
  }
  const params = new URLSearchParams({
    vs_currency: 'usd',
    days: days.toString(),
  });
  try {
    const response = await fetch(`${API_BASE_URL}/coins/${id}/market_chart?${params.toString()}`, { headers, next: { revalidate: 300 } });
    return handleResponse<MarketChart>(response);
  } catch (error) {
    console.error('Fetch Error:', error);
    return { error: 'An unexpected network error occurred.' };
  }
}
