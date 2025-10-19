import { useState } from 'react';
import { StakeNFTDynamic } from './StakeNFTDynamic';
import { UnstakeNFTDynamic } from './UnstakeNFTDynamic';
import { ClaimRewardsDynamic } from './ClaimRewardsDynamic';
import { BurnNFTDynamic } from './BurnNFTDynamic';

type TabType = 'stake' | 'unstake' | 'claim' | 'burn';

interface StakingTabsDynamicProps {
  stakingContractAddress: `0x${string}`;
  nftContractAddress: `0x${string}`;
}

export function StakingTabsDynamic({ stakingContractAddress, nftContractAddress }: StakingTabsDynamicProps) {
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
        {activeTab === 'stake' && (
          <StakeNFTDynamic
            stakingContractAddress={stakingContractAddress}
            nftContractAddress={nftContractAddress}
          />
        )}
        {activeTab === 'unstake' && (
          <UnstakeNFTDynamic stakingContractAddress={stakingContractAddress} />
        )}
        {activeTab === 'claim' && (
          <ClaimRewardsDynamic stakingContractAddress={stakingContractAddress} />
        )}
        {activeTab === 'burn' && (
          <BurnNFTDynamic stakingContractAddress={stakingContractAddress} />
        )}
      </div>
    </div>
  );
}
