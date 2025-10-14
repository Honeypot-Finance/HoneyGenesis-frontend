"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { StakingTabs } from "@/components/StakingTabs";
import { RewardsDisplay } from "@/components/RewardsDisplay";
import { StakingStats } from "@/components/StakingStats";
import { NFTRollingBanner } from "@/components/NFTRollingBanner";

export default function Home() {
  const { isConnected } = useAccount();
  const [isHowItWorksExpanded, setIsHowItWorksExpanded] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{ background: "#140D06" }}
    >
      {/* Header */}
      <header
        className="border-b"
        style={{
          background: "#271A0C",
          borderColor: "rgba(245, 158, 11, 0.2)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: "#F59E0B" }}
              >
                Honeypot NFT Staking
              </h1>
              <p
                className="text-xs sm:text-sm mt-1"
                style={{ color: "#999999" }}
              >
                Stake your NFTs and earn rewards with dynamic multipliers
              </p>
            </div>
            <div className="w-full sm:w-auto flex justify-center sm:justify-end">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <div
              className="rounded-xl p-12 max-w-md mx-auto border"
              style={{
                background: "#271A0C",
                borderColor: "rgba(245, 158, 11, 0.2)",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
              }}
            >
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#ffffff" }}
              >
                Welcome to NFT Staking
              </h2>
              <p
                className="mb-6"
                style={{ color: "#999999" }}
              >
                Connect your wallet to start staking your NFTs and earning
                rewards
              </p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Rewards Display - Centered with Max Width */}
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <RewardsDisplay />
              </div>
            </div>

            {/* NFT Rolling Banner */}
            <NFTRollingBanner />

            {/* Staking Tabs - Stake, Unstake, Claim, Burn */}
            <StakingTabs />

            {/* Staking Stats - Collapsible */}
            <StakingStats />

            {/* How It Works - Collapsible */}
            <div
              className="rounded-xl border"
              style={{
                background: "#271A0C",
                borderColor: "rgba(245, 158, 11, 0.2)",
              }}
            >
              {/* Collapsible Header */}
              <button
                onClick={() => setIsHowItWorksExpanded(!isHowItWorksExpanded)}
                className="w-full p-4 flex justify-between items-center transition-all"
                style={{ color: "#ffffff" }}
              >
                <h2
                  className="text-xl font-bold"
                  style={{ color: "#F59E0B" }}
                >
                  How It Works
                </h2>
                <svg
                  className="w-5 h-5 transition-transform"
                  style={{
                    transform: isHowItWorksExpanded
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    color: "#F59E0B",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Collapsible Content */}
              {isHowItWorksExpanded && (
                <div className="px-4 pb-4 space-y-4">
                  <div>
                    <h3
                      className="font-semibold text-lg mb-2"
                      style={{ color: "#ffffff" }}
                    >
                      1. Stake Your NFT
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "#999999" }}
                    >
                      Deposit your NFT into the staking contract to start
                      earning rewards. You&apos;ll need to approve the contract
                      first.
                    </p>
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-lg mb-2"
                      style={{ color: "#ffffff" }}
                    >
                      2. Earn Rewards with Multipliers
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "#999999" }}
                    >
                      Rewards accrue every second based on the current reward
                      rate. Your multiplier increases by 1x for every 30 days
                      staked (e.g., 2x after 30 days, 3x after 60 days).
                    </p>
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-lg mb-2"
                      style={{ color: "#ffffff" }}
                    >
                      3. Claim or Unstake
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "#999999" }}
                    >
                      Claim your rewards at any time without unstaking, or
                      unstake to get your NFT back (rewards are automatically
                      claimed on unstake).
                    </p>
                  </div>
                  <div>
                    <h3
                      className="font-semibold text-lg mb-2"
                      style={{ color: "#FF494A" }}
                    >
                      4. Burn for Bonus (Optional)
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "#999999" }}
                    >
                      Burn your staked NFT permanently to earn additional bonus
                      rewards. The burn bonus percentage is set by the contract
                      owner. This action is irreversible!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className="border-t mt-12"
        style={{
          background: "#271A0C",
          borderColor: "rgba(245, 158, 11, 0.2)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p
            className="text-center text-sm"
            style={{ color: "#666666" }}
          >
            Built with Next.js, wagmi, and RainbowKit
          </p>
        </div>
      </footer>
    </div>
  );
}
