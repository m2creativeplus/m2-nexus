'use client';

import { useState, useEffect, useCallback } from 'react';

interface FeedOptions {
  pollInterval?: number; // milliseconds between polls (default: 5000)
  onError?: (error: Error) => void;
}

/**
 * Hook for real-time data feeds
 * Usage: const { data, loading, error } = useDataFeed('/api/feeds/projects', { pollInterval: 5000 });
 */
export function useDataFeed<T>(
  endpoint: string,
  options: FeedOptions = {}
) {
  const { pollInterval = 5000, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(endpoint);
      
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      
      const json = await res.json();
      setData(json.data);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, onError]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up polling interval
    const interval = setInterval(fetchData, pollInterval);
    return () => clearInterval(interval);
  }, [fetchData, pollInterval]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for project metrics
 */
export function useProjectMetrics() {
  return useDataFeed('/api/feeds/projects', { pollInterval: 10000 });
}

/**
 * Hook for system statistics
 */
export function useSystemStats() {
  return useDataFeed('/api/feeds/system-stats', { pollInterval: 5000 });
}

/**
 * Hook for live logs
 */
export function useLiveLogs() {
  return useDataFeed('/api/feeds/logs', { pollInterval: 3000 });
}

/**
 * Hook for agent activity
 */
export function useAgentActivity() {
  return useDataFeed('/api/feeds/agents', { pollInterval: 8000 });
}

/**
 * Hook for dashboard metrics (all-in-one)
 */
export function useDashboardMetrics() {
  return useDataFeed('/api/feeds/dashboard', { pollInterval: 5000 });
}
