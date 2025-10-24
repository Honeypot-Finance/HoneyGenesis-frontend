import { useState, useRef, useEffect } from 'react';
import { StakeNFT, StakeNFTRef } from './StakeNFT';
import { UnstakeNFT, UnstakeNFTRef } from './UnstakeNFT';
import { ClaimRewards } from './ClaimRewards';
import { BurnNFT } from './BurnNFT';

type TabType = 'stake' | 'unstake' | 'claim' | 'burn';

export function StakingTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('stake');
  const [shouldRefetchWallet, setShouldRefetchWallet] = useState(false);
  const stakeNFTRef = useRef<StakeNFTRef>(null);
  const unstakeNFTRef = useRef<UnstakeNFTRef>(null);

  const tabs = [
    { id: 'stake' as TabType, label: 'Stake NFT' },
    { id: 'unstake' as TabType, label: 'Unstake NFT' },
    { id: 'claim' as TabType, label: 'Claim Rewards' },
    { id: 'burn' as TabType, label: 'Burn NFT' },
  ];

  const handleStakeSuccess = () => {
    console.log('Stake successful, refetching staked NFTs list...');
    // Refetch the unstake tab to show newly staked NFTs
    const refetchStaked = async (attempts = 0, maxAttempts = 5) => {
      if (attempts >= maxAttempts) {
        console.log('Max staked NFTs refetch attempts reached');
        return;
      }
      const delay = 2000 * (attempts + 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      console.log(`Refetching staked NFTs (attempt ${attempts + 1}/${maxAttempts})...`);
      await unstakeNFTRef.current?.refetchStakedNFTs();
      refetchStaked(attempts + 1, maxAttempts);
    };
    refetchStaked();
  };

  const handleUnstakeSuccess = () => {
    // Mark that we need to refetch wallet NFTs
    setShouldRefetchWallet(true);
    // Switch to the Stake tab to show the unstaked NFT in wallet
    console.log('Unstake successful, switching to Stake tab...');
    setActiveTab('stake');
  };

  // Refetch wallet NFTs when switching to stake tab after unstaking
  useEffect(() => {
    const refetchWalletWithPolling = async () => {
      if (activeTab === 'stake' && shouldRefetchWallet) {
        console.log('Stake tab is now active, starting wallet NFT polling...');
        setShouldRefetchWallet(false);

        // Poll for subgraph updates with exponential backoff
        const pollWallet = async (attempts = 0, maxAttempts = 8) => {
          if (attempts >= maxAttempts) {
            console.log('Max wallet refetch attempts reached');
            return;
          }

          // Wait with exponential backoff: 3s, 5s, 7s, 9s, 11s, 13s, 15s, 17s
          const delay = 3000 + (attempts * 2000);
          console.log(`Waiting ${delay/1000}s before wallet refetch attempt ${attempts + 1}/${maxAttempts}...`);
          await new Promise(resolve => setTimeout(resolve, delay));

          console.log(`Refetching wallet NFTs (attempt ${attempts + 1}/${maxAttempts})...`);
          await stakeNFTRef.current?.refetchWalletNFTs();

          // Continue polling
          pollWallet(attempts + 1, maxAttempts);
        };

        // Start polling
        pollWallet();
      }
    };

    refetchWalletWithPolling();
  }, [activeTab, shouldRefetchWallet]);

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
        {activeTab === 'stake' && <StakeNFT ref={stakeNFTRef} onSuccess={handleStakeSuccess} />}
        {activeTab === 'unstake' && <UnstakeNFT ref={unstakeNFTRef} onSuccess={handleUnstakeSuccess} />}
        {activeTab === 'claim' && <ClaimRewards />}
        {activeTab === 'burn' && <BurnNFT />}
      </div>
    </div>
  );
}
