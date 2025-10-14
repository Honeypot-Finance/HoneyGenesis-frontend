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
    <div className="staking-tabs-container">
      {/* Tab Headers */}
      <div className="staking-tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`staking-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="staking-tab-content">
        {activeTab === 'stake' && <StakeNFT />}
        {activeTab === 'unstake' && <UnstakeNFT />}
        {activeTab === 'claim' && <ClaimRewards />}
        {activeTab === 'burn' && <BurnNFT />}
      </div>
    </div>
  );
}
