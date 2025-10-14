'use client';

import { useState, useEffect } from 'react';
import { useContractOwner, useSetParameters, useStakingParams } from '@/hooks/useNFTStaking';
import { parseTokenAmount, formatTokenAmount } from '@/lib/utils';

export function AdminPanel() {
  const { isOwner } = useContractOwner();
  const { rewardRatePerSecond, burnBonusBps } = useStakingParams();
  const { setParameters, isPending, isConfirming, isSuccess } = useSetParameters();

  const [rewardRate, setRewardRate] = useState('');
  const [burnBonus, setBurnBonus] = useState('');

  // Initialize form with current values
  useEffect(() => {
    if (rewardRatePerSecond) {
      setRewardRate(formatTokenAmount(rewardRatePerSecond, 18, 18));
    }
    if (burnBonusBps !== undefined) {
      setBurnBonus((Number(burnBonusBps) / 100).toString());
    }
  }, [rewardRatePerSecond, burnBonusBps]);

  if (!isOwner) {
    return null; // Don't show admin panel to non-owners
  }

  const handleUpdate = () => {
    if (!rewardRate || !burnBonus) return;

    const rateWei = parseTokenAmount(rewardRate, 18);
    const bonusBps = BigInt(Math.floor(parseFloat(burnBonus) * 100));

    if (
      !confirm(
        `Are you sure you want to update the staking parameters?\n\nNew reward rate: ${rewardRate} per second\nNew burn bonus: ${burnBonus}%`
      )
    ) {
      return;
    }

    setParameters(rateWei, bonusBps);
  };

  return (
    <div className="rounded-xl p-6 border-2" style={{
      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      borderColor: '#F59E0B',
      boxShadow: '0 4px 24px rgba(245, 158, 11, 0.25)'
    }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>🔐 Admin Panel</h2>
      <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
        You are the contract owner. You can update staking parameters here.
      </p>

      <div className="space-y-4 rounded-xl p-4" style={{
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)'
      }}>
        <div>
          <label htmlFor="rewardRate" className="block text-sm font-medium mb-2" style={{ color: '#ffffff' }}>
            Reward Rate (tokens per second)
          </label>
          <input
            id="rewardRate"
            type="text"
            value={rewardRate}
            onChange={(e) => setRewardRate(e.target.value)}
            placeholder="0.0001"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff'
            }}
          />
          <p className="text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
            Example: 0.0001 = 0.0001 tokens per second
          </p>
        </div>

        <div>
          <label htmlFor="burnBonus" className="block text-sm font-medium mb-2" style={{ color: '#ffffff' }}>
            Burn Bonus (%)
          </label>
          <input
            id="burnBonus"
            type="number"
            value={burnBonus}
            onChange={(e) => setBurnBonus(e.target.value)}
            placeholder="20"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff'
            }}
          />
          <p className="text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
            Example: 20 = 20% bonus for burned NFTs
          </p>
        </div>

        <button
          onClick={handleUpdate}
          disabled={!rewardRate || !burnBonus || isPending || isConfirming}
          className="w-full font-semibold py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          style={{
            background: '#ffffff',
            color: '#D97706'
          }}
          onMouseOver={(e) => {
            if (rewardRate && burnBonus && !isPending && !isConfirming) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
            }
          }}
          onMouseOut={(e) => {
            if (rewardRate && burnBonus && !isPending && !isConfirming) {
              e.currentTarget.style.background = '#ffffff';
            }
          }}
        >
          {isPending || isConfirming ? 'Updating...' : 'Update Parameters'}
        </button>

        {isSuccess && (
          <div className="p-3 rounded-xl border" style={{
            background: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgba(16, 185, 129, 0.3)'
          }}>
            <p className="text-sm font-medium" style={{ color: '#ffffff' }}>Parameters updated successfully!</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Changes will take effect for all future rewards
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
