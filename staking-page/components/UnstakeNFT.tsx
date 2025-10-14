'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useUnstake } from '@/hooks/useNFTStaking';
import { NFTSelector } from './NFTSelector';

export function UnstakeNFT() {
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { unstake, isPending, isConfirming, isSuccess } = useUnstake();

  // Refresh data 2 seconds after successful unstake
  useEffect(() => {
    if (isSuccess) {
      toast.success('NFT unstaked successfully! 🎉', {
        style: {
          background: '#271A0C',
          border: '1px solid #10B981',
          color: '#10B981',
        },
      });
      const timer = setTimeout(() => {
        console.log('Refreshing NFT data after unstake...');
        setRefetchTrigger(prev => prev + 1);
        setSelectedTokenId(undefined);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleUnstake = () => {
    if (selectedTokenId === undefined) return;
    unstake(selectedTokenId);
  };

  return (
    <div className="space-y-4">
        <NFTSelector
          onSelect={setSelectedTokenId}
          selectedTokenId={selectedTokenId}
          mode="staked"
          title="Select NFT to Unstake"
          key={refetchTrigger}
        />

        <button
          onClick={handleUnstake}
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
          {isPending || isConfirming ? 'Unstaking...' : 'Unstake NFT'}
        </button>
    </div>
  );
}
