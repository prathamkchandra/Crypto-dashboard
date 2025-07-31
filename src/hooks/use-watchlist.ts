'use client';

import { useState, useEffect, useCallback } from 'react';

const WATCHLIST_KEY = 'coinlookout_watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem(WATCHLIST_KEY);
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (error) {
      console.error("Failed to parse watchlist from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  const updateLocalStorage = (updatedWatchlist: string[]) => {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));
    } catch (error) {
      console.error("Failed to save watchlist to localStorage", error);
    }
  };

  const toggleWatchlist = useCallback((coinId: string) => {
    setWatchlist(prev => {
      const newWatchlist = prev.includes(coinId)
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId];
      updateLocalStorage(newWatchlist);
      return newWatchlist;
    });
  }, []);

  const isWatched = useCallback((coinId: string) => {
    return watchlist.includes(coinId);
  }, [watchlist]);

  return { watchlist, toggleWatchlist, isWatched, isInitialized };
}
