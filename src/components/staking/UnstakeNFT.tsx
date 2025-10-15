import { useState, useEffect } from 'react';
import { useUnstake } from '@/hooks/useNFTStaking';
import { NFTSelector } from './NFTSelector';
import GeneralButton from '../atoms/GeneralButton/GeneralButton';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { openPopUp } from '@/config/redux/popUpSlice';

export function UnstakeNFT() {
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { unstake, isPending, isConfirming, isSuccess, hash } = useUnstake();
  const dispatch = useAppDispatch();

  const getExplorerUrl = (txHash: string) => {
    return `https://testnet.berascan.com/tx/${txHash}`;
  };

  useEffect(() => {
    if (isSuccess && hash) {
      dispatch(openPopUp({
        title: 'Unstake Success',
        message: `NFT unstaked successfully!\n\nTransaction: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
        info: 'success',
        link: getExplorerUrl(hash),
        linkText: 'View on Explorer',
      }));
      const timer = setTimeout(() => {
        setRefetchTrigger(prev => prev + 1);
        setSelectedTokenId(undefined);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, hash, dispatch]);

  const handleUnstake = () => {
    if (selectedTokenId === undefined) return;
    unstake(selectedTokenId);
  };

  return (
    <div>
      <NFTSelector
        onSelect={setSelectedTokenId}
        selectedTokenId={selectedTokenId}
        mode="staked"
        title="Select NFT to Unstake"
        key={refetchTrigger}
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
