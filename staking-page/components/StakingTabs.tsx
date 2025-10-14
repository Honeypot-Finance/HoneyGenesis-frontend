'use client';

import { useState } from 'react';
import { StakeNFT } from './StakeNFT';
import { UnstakeNFT } from './UnstakeNFT';
import { ClaimRewards } from './ClaimRewards';
import { BurnNFT } from './BurnNFT';

type TabType = 'stake' | 'unstake' | 'claim' | 'burn';

export function StakingTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('stake');

  const tabs = [
    { id: 'stake' as TabType, label: 'Stake NFT' },
    { id: 'unstake' as TabType, label: 'Unstake NFT' },
    { id: 'claim' as TabType, label: 'Claim Rewards' },
    { id: 'burn' as TabType, label: 'Burn NFT' },
  ];

  return (
    <div className="rounded-xl border" style={{
      background: '#271A0C',
      borderColor: 'rgba(245, 158, 11, 0.2)'
    }}>
      {/* Tab Headers */}
      <div className="flex border-b" style={{
        borderColor: 'rgba(245, 158, 11, 0.2)'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 px-4 py-4 font-semibold transition-all relative"
            style={{
              color: activeTab === tab.id ? '#F59E0B' : '#999999',
              background: activeTab === tab.id ? 'rgba(245, 158, 11, 0.1)' : 'transparent'
            }}
            onMouseOver={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = '#F59E0B';
                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.05)';
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = '#999999';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {tab.label}
            {/* Active Tab Indicator */}
            {activeTab === tab.id && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: '#F59E0B' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'stake' && <StakeNFT />}
        {activeTab === 'unstake' && <UnstakeNFT />}
        {activeTab === 'claim' && <ClaimRewards />}
        {activeTab === 'burn' && <BurnNFT />}
      </div>
    </div>
  );
}
