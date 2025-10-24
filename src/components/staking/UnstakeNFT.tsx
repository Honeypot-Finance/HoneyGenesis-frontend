import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useBatchUnstake } from '@/hooks/useNFTStaking';
import { NFTSelector, NFTSelectorRef } from './NFTSelector';
import GeneralButton from '../atoms/GeneralButton/GeneralButton';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { openPopUp } from '@/config/redux/popUpSlice';

export interface UnstakeNFTRef {
  refetchStakedNFTs: () => Promise<void>;
}

interface UnstakeNFTProps {
  onSuccess?: () => void;
}

export const UnstakeNFT = forwardRef<UnstakeNFTRef, UnstakeNFTProps>(({ onSuccess }, ref) => {
  const [selectedTokenIds, setSelectedTokenIds] = useState<bigint[]>([]);
  const stakedNFTSelectorRef = useRef<NFTSelectorRef>(null);
  const { batchUnstake, isPending, isConfirming, isSuccess, hash, allHashes, currentBatch, totalBatches } = useBatchUnstake();
  const dispatch = useAppDispatch();

  // Expose refetch function to parent via ref
  useImperativeHandle(ref, () => ({
    refetchStakedNFTs: async () => {
      await stakedNFTSelectorRef.current?.refetch();
    },
  }));

  const getExplorerUrl = (txHash: string) => {
    return `https://berascan.com/tx/${txHash}`;
  };

  useEffect(() => {
    if (isSuccess && allHashes && allHashes.length > 0) {
      const hashesText = allHashes.length === 1
        ? `Transaction: ${allHashes[0].slice(0, 10)}...${allHashes[0].slice(-8)}`
        : `${allHashes.length} transactions completed\nLast: ${allHashes[allHashes.length - 1].slice(0, 10)}...${allHashes[allHashes.length - 1].slice(-8)}`;

      dispatch(openPopUp({
        title: 'Unstake Success',
        message: `${selectedTokenIds.length} NFT${selectedTokenIds.length > 1 ? 's' : ''} unstaked successfully! Switch to the "Stake NFT" tab to see them in your wallet.\n\n${hashesText}`,
        info: 'success',
        link: getExplorerUrl(allHashes[allHashes.length - 1]),
        linkText: 'View Last Transaction',
      }));

      // Refetch the staked NFTs list to remove the unstaked NFTs
      const refetchStaked = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Refetching staked NFTs list...');
        await stakedNFTSelectorRef.current?.refetch();
      };

      refetchStaked();
      setSelectedTokenIds([]);

      // Call the success callback to switch tabs
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2500);
      }
    }
  }, [isSuccess, allHashes, dispatch, onSuccess, selectedTokenIds.length]);

  const handleUnstake = () => {
    if (selectedTokenIds.length === 0) return;
    batchUnstake(selectedTokenIds);
  };

  return (
    <div>
      <NFTSelector
        ref={stakedNFTSelectorRef}
        onSelect={() => {}} // Not used in multi-select mode
        onMultiSelect={setSelectedTokenIds}
        selectedTokenIds={selectedTokenIds}
        multiSelect={true}
        mode="burnable"
        title="Select NFTs to Unstake"
      />

      <GeneralButton
        onClick={handleUnstake}
        disabled={selectedTokenIds.length === 0}
        loading={isPending || isConfirming}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        {isPending || isConfirming
          ? currentBatch > 0
            ? `Unstaking Batch ${currentBatch}/${totalBatches}...`
            : 'Preparing...'
          : `Unstake ${selectedTokenIds.length > 0 ? selectedTokenIds.length : ''} NFT${selectedTokenIds.length > 1 ? 's' : selectedTokenIds.length === 1 ? '' : 's'}`}
      </GeneralButton>
    </div>
  );
});
