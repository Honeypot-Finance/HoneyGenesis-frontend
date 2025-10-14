'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { StakeNFT } from '@/components/StakeNFT';
import { UnstakeNFT } from '@/components/UnstakeNFT';
import { ClaimRewards } from '@/components/ClaimRewards';
import { BurnNFT } from '@/components/BurnNFT';
import { RewardsDisplay } from '@/components/RewardsDisplay';
import { StakeInfo } from '@/components/StakeInfo';
import { StakingStats } from '@/components/StakingStats';
import { AdminPanel } from '@/components/AdminPanel';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">NFT Staking DApp</h1>
              <p className="text-sm text-gray-600 mt-1">
                Stake your NFTs and earn rewards with multipliers
              </p>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-lg shadow-lg p-12 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to NFT Staking
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your wallet to start staking your NFTs and earning rewards
              </p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Rewards Display */}
            <RewardsDisplay />

            {/* Admin Panel (only visible to owner) */}
            <AdminPanel />

            {/* Staking Stats */}
            <StakingStats />

            {/* Main Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StakeNFT />
              <UnstakeNFT />
              <ClaimRewards />
            </div>

            {/* Burn Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BurnNFT />
              <StakeInfo />
            </div>

            {/* Info Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">How It Works</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-lg mb-2">1. Stake Your NFT</h3>
                  <p className="text-sm">
                    Deposit your NFT into the staking contract to start earning rewards. You&apos;ll
                    need to approve the contract first.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">2. Earn Rewards with Multipliers</h3>
                  <p className="text-sm">
                    Rewards accrue every second based on the current reward rate. Your multiplier
                    increases by 1x for every 30 days staked (e.g., 2x after 30 days, 3x after 60
                    days).
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">3. Claim or Unstake</h3>
                  <p className="text-sm">
                    Claim your rewards at any time without unstaking, or unstake to get your NFT
                    back (rewards are automatically claimed on unstake).
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-red-600">
                    4. Burn for Bonus (Optional)
                  </h3>
                  <p className="text-sm">
                    Burn your staked NFT permanently to earn additional bonus rewards. The burn
                    bonus percentage is set by the contract owner. This action is irreversible!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Built with Next.js, wagmi, and RainbowKit
          </p>
        </div>
      </footer>
    </div>
  );
}
