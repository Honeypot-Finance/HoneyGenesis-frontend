import { useState, useEffect, useRef } from 'react';
import { useBatchClaim, useMultiPreviewPayout } from '@/hooks/useNFTStaking';
import { useRewardsTokenInfo } from '@/hooks/useRewardsToken';
import { formatTokenAmount } from '@/lib/stakingUtils';
import { NFTSelector, NFTSelectorRef } from './NFTSelector';
import GeneralButtonClean from '../atoms/GeneralButtonClean/GeneralButtonClean';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { openPopUp } from '@/config/redux/popUpSlice';

export function ClaimRewards() {
  const [selectedTokenIds, setSelectedTokenIds] = useState<bigint[]>([]);
  const claimableNFTSelectorRef = useRef<NFTSelectorRef>(null);
  const { batchClaim, isPending, isConfirming, isSuccess, hash, allHashes, currentBatch, totalBatches } = useBatchClaim();
  const { totalPendingRewards } = useMultiPreviewPayout(selectedTokenIds);
  const { symbol, decimals } = useRewardsTokenInfo();
  const dispatch = useAppDispatch();

  const getExplorerUrl = (txHash: string) => {
    return `https://berascan.com/tx/${txHash}`;
  };

  const burnTokenUrl = "https://leaderboard.honeypotfinance.xyz/all-in-one-vault?selectburntoken=0xa32bfaf94e37911d08531212d32eade94389243b";

  useEffect(() => {
    if (isSuccess && allHashes && allHashes.length > 0) {
      const hashesText = allHashes.length === 1
        ? `Transaction: ${allHashes[0].slice(0, 10)}...${allHashes[0].slice(-8)}`
        : `${allHashes.length} transactions completed\nLast: ${allHashes[allHashes.length - 1].slice(0, 10)}...${allHashes[allHashes.length - 1].slice(-8)}`;

      // First show success popup
      dispatch(openPopUp({
        title: 'Claim Success',
        message: `Rewards for ${selectedTokenIds.length} NFT${selectedTokenIds.length > 1 ? 's' : ''} claimed successfully!\n\n${hashesText}`,
        info: 'success',
        link: getExplorerUrl(allHashes[allHashes.length - 1]),
        linkText: 'View Last Transaction',
      }));

      // After 3 seconds, show burn suggestion popup
      const burnSuggestionTimer = setTimeout(() => {
        dispatch(openPopUp({
          title: '🔥 Turn Rewards Into Real Value',
          message: `Your reward tokens gain value when burned!\n\nBurning tokens unlocks real earnings in the All-in-One Vault. Don't just hold - maximize your value by burning now!`,
          info: 'info',
          link: burnTokenUrl,
          linkText: '🔥 Burn for Value Now',
        }));
      }, 3000);

      // Poll for subgraph updates
      const refetchWithRetry = async (attempts = 0, maxAttempts = 5) => {
        if (attempts >= maxAttempts) {
          console.log("Max refetch attempts reached");
          setSelectedTokenIds([]);
          return;
        }

        const delay = 2000 * (attempts + 1);
        await new Promise((resolve) => setTimeout(resolve, delay));

        console.log(`Refetching NFTs (attempt ${attempts + 1}/${maxAttempts})...`);
        await claimableNFTSelectorRef.current?.refetch();

        refetchWithRetry(attempts + 1, maxAttempts);
      };

      refetchWithRetry();
      setSelectedTokenIds([]);

      return () => {
        clearTimeout(burnSuggestionTimer);
      };
    }
  }, [isSuccess, allHashes, dispatch, selectedTokenIds.length]);

  const handleClaim = () => {
    if (selectedTokenIds.length === 0) return;
    batchClaim(selectedTokenIds);
  };

  return (
    <div>
      <NFTSelector
        ref={claimableNFTSelectorRef}
        onSelect={() => {}} // Not used in multi-select mode
        onMultiSelect={setSelectedTokenIds}
        selectedTokenIds={selectedTokenIds}
        multiSelect={true}
        mode="claimable"
        title="Select NFTs to Claim Rewards"
      />

      {selectedTokenIds.length > 0 && totalPendingRewards !== undefined && decimals !== undefined && (
        <div className="info-box" style={{
          background: 'linear-gradient(135deg, rgba(247, 149, 29, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
          border: '2px solid #ffcd4d',
          marginTop: '1rem'
        }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#ffcd4d', marginBottom: '0.5rem' }}>
            Total Claimable Rewards ({selectedTokenIds.length} NFT{selectedTokenIds.length > 1 ? 's' : ''})
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', margin: '0.5rem 0' }}>
            {formatTokenAmount(totalPendingRewards, decimals, 6)} {symbol || 'REWARD'}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#999999', marginTop: '0.5rem' }}>
            Claim now to add these rewards to your wallet
          </p>
        </div>
      )}

      <GeneralButtonClean
        onClick={handleClaim}
        disabled={selectedTokenIds.length === 0}
        loading={isPending || isConfirming}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        {isPending || isConfirming
          ? currentBatch > 0
            ? `Claiming NFT ${currentBatch}/${totalBatches}...`
            : 'Preparing...'
          : `Claim ${selectedTokenIds.length > 0 ? selectedTokenIds.length : ''} NFT${selectedTokenIds.length > 1 ? 's' : selectedTokenIds.length === 1 ? '' : 's'}`}
      </GeneralButtonClean>
    </div>
  );
}
