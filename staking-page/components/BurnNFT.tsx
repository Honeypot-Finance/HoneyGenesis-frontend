'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useBurn } from '@/hooks/useNFTStaking';
import { useStakingParams } from '@/hooks/useNFTStaking';
import { formatBps } from '@/lib/utils';
import { NFTSelector } from './NFTSelector';

export function BurnNFT() {
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { burn, isPending, isConfirming, isSuccess } = useBurn();
  const { burnBonusBps } = useStakingParams();

  // Refresh data 2 seconds after successful burn
  useEffect(() => {
    if (isSuccess) {
      toast.success('NFT burned successfully! 🔥 You are now earning bonus rewards!', {
        style: {
          background: '#271A0C',
          border: '1px solid #F59E0B',
          color: '#F59E0B',
        },
      });
      const timer = setTimeout(() => {
        console.log('Refreshing NFT data after burn...');
        setRefetchTrigger(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleBurn = () => {
    if (selectedTokenId === undefined) return;
    if (!confirm('Are you sure you want to burn this NFT? This action cannot be undone! The NFT will be destroyed, and you will start earning burn bonus rewards.')) {
      return;
    }
    burn(selectedTokenId);
  };

  return (
    <div className="space-y-4">
      {burnBonusBps && (
        <div className="p-3 rounded-xl border" style={{
          background: 'rgba(245, 158, 11, 0.1)',
          borderColor: '#F59E0B'
        }}>
          <p className="text-sm font-semibold" style={{ color: '#F59E0B' }}>
            Current burn bonus: <span className="font-bold">{formatBps(burnBonusBps)}</span>
          </p>
          <p className="text-xs mt-1" style={{ color: '#999999' }}>
            Burning increases your rewards by this percentage
          </p>
        </div>
      )}

      <NFTSelector
          onSelect={setSelectedTokenId}
          selectedTokenId={selectedTokenId}
          mode="wallet"
          title="Select NFT from Wallet to Burn"
          key={refetchTrigger}
        />

      <div className="p-3 rounded-xl border" style={{
          background: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgba(59, 130, 246, 0.3)'
        }}>
          <p className="text-sm font-medium" style={{ color: '#60A5FA' }}>ℹ️ How It Works</p>
          <p className="text-xs mt-1" style={{ color: '#999999' }}>
            1. Burn your NFT from your wallet<br/>
            2. Earn rewards with the burn bonus multiplier<br/>
            3. Claim burn rewards anytime<br/>
            <br/>
            <strong>Note:</strong> The NFT must be in your wallet (NOT staked) to burn it.
          </p>
      </div>

      <div className="p-3 rounded-xl border" style={{
          background: 'rgba(255, 73, 74, 0.1)',
          borderColor: '#FF494A'
        }}>
          <p className="text-sm font-medium" style={{ color: '#FF494A' }}>⚠️ Warning</p>
          <p className="text-xs mt-1" style={{ color: '#999999' }}>
            Burning your NFT is permanent and irreversible.
            The NFT will be destroyed, and you will enter burn mode to earn bonus rewards.
          </p>
      </div>

      <button
          onClick={handleBurn}
          disabled={selectedTokenId === undefined || isPending || isConfirming}
          className="w-full font-semibold py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          style={{
            background: (selectedTokenId === undefined || isPending || isConfirming) ? '#666666' : '#FF494A',
            color: '#ffffff',
            border: '1px solid rgba(255, 73, 74, 0.3)'
          }}
          onMouseOver={(e) => {
            if (selectedTokenId !== undefined && !isPending && !isConfirming) {
              e.currentTarget.style.background = '#DC2626';
            }
          }}
          onMouseOut={(e) => {
            if (selectedTokenId !== undefined && !isPending && !isConfirming) {
              e.currentTarget.style.background = '#FF494A';
            }
          }}
        >
          {isPending || isConfirming ? 'Burning...' : 'Burn NFT'}
      </button>
    </div>
  );
}
