import { formatUnits, parseUnits } from 'viem';

/**
 * Format token amount from wei to human-readable format
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number = 18,
  maxDecimals: number = 4
): string {
  const formatted = formatUnits(amount, decimals);
  const num = parseFloat(formatted);

  if (num === 0) return '0';

  // For very small numbers, show more decimals
  if (num < 0.0001) {
    return num.toExponential(2);
  }

  return num.toFixed(maxDecimals).replace(/\.?0+$/, '');
}

/**
 * Parse token amount from human-readable to wei
 */
export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  try {
    return parseUnits(amount, decimals);
  } catch {
    return 0n;
  }
}

/**
 * Format duration in seconds to human-readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d`;
}

/**
 * Format timestamp to human-readable date
 */
export function formatDate(timestamp: bigint | number): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate multiplier based on duration
 * Multiplier = 1 + (duration / 30 days)
 */
export function calculateMultiplier(durationSeconds: number): number {
  const THIRTY_DAYS = 30 * 24 * 60 * 60;
  return 1 + Math.floor(durationSeconds / THIRTY_DAYS);
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format basis points to percentage
 */
export function formatBps(bps: bigint): string {
  const percentage = Number(bps) / 100;
  return `${percentage}%`;
}

/**
 * Calculate rewards per day
 */
export function calculateRewardsPerDay(rewardRatePerSecond: bigint): string {
  const secondsPerDay = 24 * 60 * 60;
  const rewardsPerDay = rewardRatePerSecond * BigInt(secondsPerDay);
  return formatTokenAmount(rewardsPerDay);
}
