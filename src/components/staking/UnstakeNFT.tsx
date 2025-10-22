import { useState, useEffect, useRef } from 'react';
import { useBatchUnstake } from '@/hooks/useNFTStaking';
import { NFTSelector, NFTSelectorRef } from './NFTSelector';
import GeneralButton from '../atoms/GeneralButton/GeneralButton';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { openPopUp } from '@/config/redux/popUpSlice';

interface UnstakeNFTProps {
  onSuccess?: () => void;
}

export function UnstakeNFT({ onSuccess }: UnstakeNFTProps) {
  const [selectedTokenIds, setSelectedTokenIds] = useState<bigint[]>([]);
  const stakedNFTSelectorRef = useRef<NFTSelectorRef>(null);
  const { batchUnstake, isPending, isConfirming, isSuccess, hash } = useBatchUnstake();
  const dispatch = useAppDispatch();

  const getExplorerUrl = (txHash: string) => {
    return `https://berascan.com/tx/${txHash}`;
  };

  useEffect(() => {
    if (isSuccess && hash) {
      dispatch(openPopUp({
        title: 'Unstake Success',
        message: `${selectedTokenIds.length} NFT${selectedTokenIds.length > 1 ? 's' : ''} unstaked successfully! Switch to the "Stake NFT" tab to see them in your wallet.\n\nTransaction: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
        info: 'success',
        link: getExplorerUrl(hash),
        linkText: 'View on Explorer',
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
  }, [isSuccess, hash, dispatch, onSuccess, selectedTokenIds.length]);

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
        {isPending || isConfirming ? 'Unstaking...' : `Unstake ${selectedTokenIds.length > 0 ? selectedTokenIds.length : ''} NFT${selectedTokenIds.length > 1 ? 's' : selectedTokenIds.length === 1 ? '' : 's'}`}
      </GeneralButton>
    </div>
  );
}
