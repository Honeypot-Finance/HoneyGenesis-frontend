'use client';

import { useState } from 'react';
import { useStakingParams } from '@/hooks/useNFTStaking';
import { formatTokenAmount, formatBps, calculateRewardsPerDay } from '@/lib/utils';

export function StakingStats() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { rewardRatePerSecond, burnBonusBps } = useStakingParams();

  return (
    <div className="rounded-xl border" style={{
      background: '#271A0C',
      borderColor: 'rgba(245, 158, 11, 0.2)'
    }}>
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex justify-between items-center transition-all"
        style={{ color: '#ffffff' }}
      >
        <h2 className="text-xl font-bold" style={{ color: '#F59E0B' }}>Staking Parameters</h2>
        <svg
          className="w-5 h-5 transition-transform"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            color: '#F59E0B'
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rewardRatePerSecond !== undefined && (
              <div className="p-4 rounded-xl border" style={{
                background: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 0.3)'
              }}>
                <p className="text-sm font-semibold" style={{ color: '#60A5FA' }}>Base Rewards per Second</p>
                <p className="text-xl font-bold" style={{ color: '#60A5FA' }}>
                  {formatTokenAmount(rewardRatePerSecond, 18, 6)}
                </p>
                <p className="text-xs mt-1" style={{ color: '#999999' }}>
                  ≈ {calculateRewardsPerDay(rewardRatePerSecond)} per day (at 1x multiplier)
                </p>
              </div>
            )}

            {burnBonusBps !== undefined && (
              <div className="p-4 rounded-xl border" style={{
                background: 'rgba(245, 158, 11, 0.1)',
                borderColor: '#F59E0B'
              }}>
                <p className="text-sm font-semibold" style={{ color: '#F59E0B' }}>Burn Bonus</p>
                <p className="text-xl font-bold" style={{ color: '#F59E0B' }}>+{formatBps(burnBonusBps)}</p>
                <p className="text-xs mt-1" style={{ color: '#999999' }}>
                  Additional rewards for burning your NFT
                </p>
              </div>
            )}

            <div className="p-4 rounded-xl border" style={{
              background: 'rgba(168, 85, 247, 0.1)',
              borderColor: 'rgba(168, 85, 247, 0.3)'
            }}>
              <p className="text-sm font-medium" style={{ color: '#A78BFA' }}>Multiplier System</p>
              <p className="text-xs mt-1" style={{ color: '#999999' }}>
                Your rewards increase by 1x for every 30 days staked:
              </p>
              <ul className="text-xs mt-2 ml-4 list-disc space-y-1" style={{ color: '#999999' }}>
                <li>0-30 days: 1x multiplier</li>
                <li>30-60 days: 2x multiplier</li>
                <li>60-90 days: 3x multiplier</li>
                <li>And so on...</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
