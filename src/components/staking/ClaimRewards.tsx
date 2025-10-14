import { useState, useEffect } from 'react';
import { useClaim, usePreviewPayout } from '@/hooks/useNFTStaking';
import { useRewardsTokenInfo } from '@/hooks/useRewardsToken';
import { formatTokenAmount } from '@/lib/stakingUtils';
import { NFTSelector } from './NFTSelector';
import GeneralButton from '../atoms/GeneralButton/GeneralButton';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { openPopUp } from '@/config/redux/popUpSlice';

export function ClaimRewards() {
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { claim, isPending, isConfirming, isSuccess, hash } = useClaim();
  const { pendingRewards } = usePreviewPayout(selectedTokenId);
  const { symbol, decimals } = useRewardsTokenInfo();
  const dispatch = useAppDispatch();

  const getExplorerUrl = (txHash: string) => {
    return `https://testnet.berascan.com/tx/${txHash}`;
  };

  useEffect(() => {
    if (isSuccess && hash) {
      dispatch(openPopUp({
        title: 'Claim Success',
        message: `Rewards claimed successfully!\n\nTransaction: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
        info: 'success',
        link: getExplorerUrl(hash),
        linkText: 'View on Explorer',
      }));
      const timer = setTimeout(() => {
        setRefetchTrigger(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, hash, dispatch]);

  const handleClaim = () => {
    if (selectedTokenId === undefined) return;
    claim(selectedTokenId);
  };

  return (
    <div>
      <NFTSelector
        onSelect={setSelectedTokenId}
        selectedTokenId={selectedTokenId}
        mode="staked"
        title="Select Staked NFT"
        key={refetchTrigger}
      />

      {selectedTokenId !== undefined && pendingRewards !== undefined && decimals !== undefined && (
        <div className="info-box" style={{
          background: 'linear-gradient(135deg, rgba(247, 149, 29, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
          border: '2px solid #ffcd4d',
          marginTop: '1rem'
        }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#ffcd4d', marginBottom: '0.5rem' }}>
            Current Claimable Rewards
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', margin: '0.5rem 0' }}>
            {formatTokenAmount(pendingRewards, decimals, 6)} {symbol || 'REWARD'}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#999999', marginTop: '0.5rem' }}>
            Claim now to add these rewards to your wallet
          </p>
        </div>
      )}

      <GeneralButton
        onClick={handleClaim}
        disabled={selectedTokenId === undefined || isPending || isConfirming}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        {isPending || isConfirming ? 'Claiming...' : 'Claim Rewards'}
      </GeneralButton>
    </div>
  );
}
