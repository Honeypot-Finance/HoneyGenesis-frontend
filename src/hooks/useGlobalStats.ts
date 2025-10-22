import { useState, useEffect } from 'react';
import { stakingGraphqlClient } from '@/lib/graphql/client';
import { GET_GLOBAL_STATS } from '@/lib/graphql/queries';

export interface GlobalStats {
  id: string;
  totalStaked: string;
  totalBurned: string;
  totalStakingRewardsClaimed: string;
  totalBurnRewardsClaimed: string;
  totalAllRewardsClaimed: string;
}

interface GlobalStatsResponse {
  globalStats: GlobalStats | null;
}

/**
 * Hook to fetch global staking statistics
 */
export function useGlobalStats() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await stakingGraphqlClient.request<GlobalStatsResponse>(GET_GLOBAL_STATS);
        console.log('Global stats response:', data);
        setStats(data.globalStats);
      } catch (err) {
        console.error('Error fetching global stats:', err);
        setError(err as Error);
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();

    // Refetch every 30 seconds
    const intervalId = setInterval(fetchStats, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return {
    stats,
    isLoading,
    error,
  };
}
