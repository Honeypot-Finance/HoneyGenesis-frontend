'use client';

import { useState } from 'react';
import { useStakeData, usePreviewPayout } from '@/hooks/useNFTStaking';
import { formatTokenAmount, formatDate, calculateMultiplier } from '@/lib/utils';
import { NFTSelector } from './NFTSelector';

export function StakeInfo() {
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | undefined>();
  const { stakeData } = useStakeData(selectedTokenId);
  const { pendingRewards } = usePreviewPayout(selectedTokenId);

  const currentMultiplier =
    stakeData && stakeData.stakedAt > 0
      ? calculateMultiplier(Number(BigInt(Math.floor(Date.now() / 1000)) - stakeData.stakedAt))
      : 1;

  return (
    <div className="rounded-xl p-6 border" style={{
      background: '#271A0C',
      borderColor: 'rgba(245, 158, 11, 0.2)'
    }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>Check Stake Info</h2>
      <div className="space-y-4">
        <NFTSelector
          onSelect={setSelectedTokenId}
          selectedTokenId={selectedTokenId}
          mode="staked"
          title="Select NFT to Check"
        />

        {selectedTokenId && stakeData && stakeData.owner !== '0x0000000000000000000000000000000000000000' && (
          <div className="space-y-3 p-4 rounded-xl" style={{
            background: '#1a1410',
            borderColor: 'rgba(245, 158, 11, 0.1)'
          }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#F59E0B' }}>Owner</p>
              <p className="font-mono text-sm" style={{ color: '#999999' }}>{stakeData.owner}</p>
            </div>

            {stakeData.stakedAt > 0 && (
              <>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#F59E0B' }}>Staked At</p>
                  <p className="font-medium" style={{ color: '#ffffff' }}>{formatDate(stakeData.stakedAt)}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold" style={{ color: '#F59E0B' }}>Last Claim</p>
                  <p className="font-medium" style={{ color: '#ffffff' }}>{formatDate(stakeData.lastClaimAt)}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold" style={{ color: '#F59E0B' }}>Current Multiplier</p>
                  <p className="font-bold text-lg" style={{ color: '#ffffff' }}>{currentMultiplier}x</p>
                  <p className="text-xs" style={{ color: '#999999' }}>
                    +1x for every 30 days staked
                  </p>
                </div>
              </>
            )}

            {stakeData.burned && (
              <div className="p-3 rounded-xl border" style={{
                background: 'rgba(255, 73, 74, 0.1)',
                borderColor: '#FF494A'
              }}>
                <p className="text-sm font-medium" style={{ color: '#FF494A' }}>🔥 NFT Burned</p>
                <p className="text-xs mt-1" style={{ color: '#999999' }}>
                  Burned at: {formatDate(stakeData.burnedAt)}
                </p>
                {stakeData.lastBurnClaimAt > 0 && (
                  <p className="text-xs" style={{ color: '#999999' }}>
                    Last burn claim: {formatDate(stakeData.lastBurnClaimAt)}
                  </p>
                )}
              </div>
            )}

            {pendingRewards !== undefined && (
              <div className="p-4 rounded-xl border" style={{
                background: 'rgba(16, 185, 129, 0.1)',
                borderColor: '#10B981'
              }}>
                <p className="text-sm font-semibold" style={{ color: '#10B981' }}>Pending Rewards</p>
                <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
                  {formatTokenAmount(pendingRewards, 18, 6)}
                </p>
              </div>
            )}
          </div>
        )}

        {selectedTokenId && stakeData && stakeData.owner === '0x0000000000000000000000000000000000000000' && (
          <div className="p-4 rounded-xl border" style={{
            background: 'rgba(245, 158, 11, 0.1)',
            borderColor: '#F59E0B'
          }}>
            <p style={{ color: '#F59E0B' }}>This NFT is not currently staked.</p>
          </div>
        )}
      </div>
    </div>
  );
}
