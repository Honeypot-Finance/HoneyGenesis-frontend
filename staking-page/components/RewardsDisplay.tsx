'use client';

import { useAccount, useChainId } from 'wagmi';
import { useRewardsBalance, useRewardsTokenInfo } from '@/hooks/useRewardsToken';
import { useContractAddresses } from '@/hooks/useContractAddresses';
import { formatTokenAmount } from '@/lib/utils';

export function RewardsDisplay() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { balance } = useRewardsBalance(address);
  const { symbol, name, decimals } = useRewardsTokenInfo();
  const { rewardsAddress } = useContractAddresses();

  // Get block explorer URL based on chain
  const getExplorerUrl = (tokenAddress: string) => {
    // Berachain Testnet (Bepolia)
    if (chainId === 80069) {
      return `https://bartio.beratrail.io/address/${tokenAddress}`;
    }
    // Default to Berachain explorer
    return `https://bartio.beratrail.io/address/${tokenAddress}`;
  };

  return (
    <div className="rounded-xl p-6 border" style={{
      background: 'linear-gradient(135deg, #271A0C 0%, #1a1410 100%)',
      borderColor: '#F59E0B',
      boxShadow: '0 4px 24px rgba(245, 158, 11, 0.15)'
    }}>
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold" style={{ color: '#F59E0B' }}>Your Rewards Balance</h2>
        {rewardsAddress && (
          <a
            href={getExplorerUrl(rewardsAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1 rounded-lg transition-all text-xs font-medium"
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              borderColor: 'rgba(245, 158, 11, 0.3)',
              color: '#F59E0B',
              border: '1px solid'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
            }}
          >
            <span>View Token</span>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>
      <div className="space-y-2">
        {balance !== undefined && decimals !== undefined ? (
          <div>
            <p className="text-4xl font-bold" style={{ color: '#ffffff' }}>
              {formatTokenAmount(balance, decimals, 6)} {symbol || 'REWARD'}
            </p>
            <p className="text-sm mt-1" style={{ color: '#999999' }}>{name || 'Rewards Token'}</p>
          </div>
        ) : (
          <p className="text-lg" style={{ color: '#999999' }}>Loading...</p>
        )}
      </div>
    </div>
  );
}
