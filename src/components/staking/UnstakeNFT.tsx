import { useState, useEffect, useRef } from 'react';
import { useUnstake } from '@/hooks/useNFTStaking';
import { NFTSelector, NFTSelectorRef } from './NFTSelector';
import GeneralButton from '../atoms/GeneralButton/GeneralButton';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { openPopUp } from '@/config/redux/popUpSlice';

interface UnstakeNFTProps {
  onSuccess?: () => void;
}

export function UnstakeNFT({ onSuccess }: UnstakeNFTProps) {
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | undefined>();
  const stakedNFTSelectorRef = useRef<NFTSelectorRef>(null);
  const { unstake, isPending, isConfirming, isSuccess, hash } = useUnstake();
  const dispatch = useAppDispatch();

  const getExplorerUrl = (txHash: string) => {
    return `https://berascan.com/tx/${txHash}`;
  };

  useEffect(() => {
    if (isSuccess && hash) {
      dispatch(openPopUp({
        title: 'Unstake Success',
        message: `NFT unstaked successfully! Switch to the "Stake NFT" tab to see it in your wallet.\n\nTransaction: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
        info: 'success',
        link: getExplorerUrl(hash),
        linkText: 'View on Explorer',
      }));

      // Refetch the staked NFTs list to remove the unstaked NFT
      const refetchStaked = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Refetching staked NFTs list...');
        await stakedNFTSelectorRef.current?.refetch();
      };

      refetchStaked();
      setSelectedTokenId(undefined);

      // Call the success callback to switch tabs
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2500);
      }
    }
  }, [isSuccess, hash, dispatch, onSuccess]);

  const handleUnstake = () => {
    if (selectedTokenId === undefined) return;
    unstake(selectedTokenId);
  };

  return (
    <div>
      <NFTSelector
        ref={stakedNFTSelectorRef}
        onSelect={setSelectedTokenId}
        selectedTokenId={selectedTokenId}
        mode="burnable"
        title="Select NFT to Unstake"
      />

      <GeneralButton
        onClick={handleUnstake}
        disabled={selectedTokenId === undefined}
        loading={isPending || isConfirming}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        {isPending || isConfirming ? 'Unstaking...' : 'Unstake NFT'}
      </GeneralButton>
    </div>
  );
}
