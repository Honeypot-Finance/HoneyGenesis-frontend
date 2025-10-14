'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useStake } from '@/hooks/useNFTStaking';
import { useApprove, useIsApproved } from '@/hooks/useNFT';
import { NFTSelector } from './NFTSelector';

export function StakeNFT() {
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { stake, isPending: isStaking, isConfirming, isSuccess } = useStake();
  const { approve, isPending: isApproving, isConfirming: isApprovingConfirming } = useApprove();
  const { isApproved } = useIsApproved(selectedTokenId);

  // Refresh data 2 seconds after successful stake
  useEffect(() => {
    if (isSuccess) {
      toast.success('NFT staked successfully! 🎉', {
        style: {
          background: '#271A0C',
          border: '1px solid #10B981',
          color: '#10B981',
        },
      });
      const timer = setTimeout(() => {
        console.log('Refreshing NFT data after stake...');
        setRefetchTrigger(prev => prev + 1);
        setSelectedTokenId(undefined); // Clear selection
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleApprove = () => {
    if (selectedTokenId === undefined) return;
    approve(selectedTokenId);
  };

  const handleStake = () => {
    if (selectedTokenId === undefined) return;
    stake(selectedTokenId);
  };

  return (
    <div className="space-y-4">
        <NFTSelector
          onSelect={setSelectedTokenId}
          selectedTokenId={selectedTokenId}
          mode="wallet"
          title="Select NFT to Stake"
          key={refetchTrigger}
        />

        {selectedTokenId !== undefined && !isApproved && (
          <button
            onClick={handleApprove}
            disabled={isApproving || isApprovingConfirming}
            className="w-full font-semibold py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              background: isApproving || isApprovingConfirming ? '#666666' : '#F59E0B',
              color: '#ffffff',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
            onMouseOver={(e) => {
              if (!isApproving && !isApprovingConfirming) {
                e.currentTarget.style.background = '#D97706';
              }
            }}
            onMouseOut={(e) => {
              if (!isApproving && !isApprovingConfirming) {
                e.currentTarget.style.background = '#F59E0B';
              }
            }}
          >
            {isApproving || isApprovingConfirming ? 'Approving...' : 'Approve NFT'}
          </button>
        )}

        {selectedTokenId !== undefined && isApproved && (
          <button
            onClick={handleStake}
            disabled={isStaking || isConfirming}
            className="w-full font-semibold py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              background: isStaking || isConfirming ? '#666666' : '#F59E0B',
              color: '#ffffff',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
            onMouseOver={(e) => {
              if (!isStaking && !isConfirming) {
                e.currentTarget.style.background = '#D97706';
              }
            }}
            onMouseOut={(e) => {
              if (!isStaking && !isConfirming) {
                e.currentTarget.style.background = '#F59E0B';
              }
            }}
          >
            {isStaking || isConfirming ? 'Staking...' : 'Stake NFT'}
          </button>
        )}
    </div>
  );
}
