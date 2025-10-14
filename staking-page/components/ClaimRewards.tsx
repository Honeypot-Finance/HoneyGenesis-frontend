'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useClaim, usePreviewPayout } from '@/hooks/useNFTStaking';
import { useRewardsTokenInfo } from '@/hooks/useRewardsToken';
import { formatTokenAmount } from '@/lib/utils';
import { NFTSelector } from './NFTSelector';

export function ClaimRewards() {
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { claim, isPending, isConfirming, isSuccess } = useClaim();
  const { pendingRewards } = usePreviewPayout(selectedTokenId);
  const { symbol, decimals } = useRewardsTokenInfo();

  // Refresh data 2 seconds after successful claim
  useEffect(() => {
    if (isSuccess) {
      toast.success('Rewards claimed successfully! 💰', {
        style: {
          background: '#271A0C',
          border: '1px solid #10B981',
          color: '#10B981',
        },
      });
      const timer = setTimeout(() => {
        console.log('Refreshing NFT data after claim...');
        setRefetchTrigger(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleClaim = () => {
    if (selectedTokenId === undefined) return;
    claim(selectedTokenId);
  };

  return (
    <div className="space-y-4">
        <NFTSelector
          onSelect={setSelectedTokenId}
          selectedTokenId={selectedTokenId}
          mode="staked"
          title="Select Staked NFT"
          key={refetchTrigger}
        />

        {/* Display Pending Rewards */}
        {selectedTokenId !== undefined && pendingRewards !== undefined && decimals !== undefined && (
          <div className="p-4 rounded-xl border" style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
            borderColor: '#F59E0B',
            boxShadow: '0 0 12px rgba(245, 158, 11, 0.2)'
          }}>
            <p className="text-sm font-semibold mb-1" style={{ color: '#F59E0B' }}>
              Current Claimable Rewards
            </p>
            <p className="text-3xl font-bold" style={{ color: '#ffffff' }}>
              {formatTokenAmount(pendingRewards, decimals, 6)} {symbol || 'REWARD'}
            </p>
            <p className="text-xs mt-1" style={{ color: '#999999' }}>
              Claim now to add these rewards to your wallet
            </p>
          </div>
        )}

        <button
          onClick={handleClaim}
          disabled={selectedTokenId === undefined || isPending || isConfirming}
          className="w-full font-semibold py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          style={{
            background: (selectedTokenId === undefined || isPending || isConfirming) ? '#666666' : '#F59E0B',
            color: '#ffffff',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}
          onMouseOver={(e) => {
            if (selectedTokenId !== undefined && !isPending && !isConfirming) {
              e.currentTarget.style.background = '#D97706';
            }
          }}
          onMouseOut={(e) => {
            if (selectedTokenId !== undefined && !isPending && !isConfirming) {
              e.currentTarget.style.background = '#F59E0B';
            }
          }}
        >
          {isPending || isConfirming ? 'Claiming...' : 'Claim Rewards'}
        </button>
    </div>
  );
}
