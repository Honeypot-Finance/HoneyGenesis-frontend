import { useState, useEffect } from 'react';
import { useBurn, useStakingParams } from '@/hooks/useNFTStaking';
import { formatBps } from '@/lib/stakingUtils';
import { NFTSelector } from './NFTSelector';
import GeneralButton from '../atoms/GeneralButton/GeneralButton';
import { useAppDispatch } from '@/hooks/useAppSelector';
import { openPopUp } from '@/config/redux/popUpSlice';

export function BurnNFT() {
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { burn, isPending, isConfirming, isSuccess, hash } = useBurn();
  const { burnBonusBps } = useStakingParams();
  const dispatch = useAppDispatch();

  const getExplorerUrl = (txHash: string) => {
    return `https://testnet.berascan.com/tx/${txHash}`;
  };

  useEffect(() => {
    if (isSuccess && hash) {
      dispatch(openPopUp({
        title: 'Burn Success',
        message: `NFT burned successfully! You are now earning bonus rewards!\n\nTransaction: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
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

  const handleBurn = () => {
    if (selectedTokenId === undefined) return;
    if (!window.confirm('Are you sure you want to burn this NFT? This action cannot be undone!')) {
      return;
    }
    burn(selectedTokenId);
  };

  const handleTestBurn = () => {
    if (!window.confirm('TEST: Are you sure you want to burn token 0? This action cannot be undone!')) {
      return;
    }
    burn(0n);
  };

  return (
    <div>
      {burnBonusBps && (
        <div className="info-box" style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#ffcd4d', margin: 0 }}>
            Current burn bonus: <span style={{ fontSize: '1.2rem' }}>{formatBps(burnBonusBps)}</span>
          </p>
          <p style={{ fontSize: '0.75rem', color: '#999999', marginTop: '0.5rem' }}>
            Burning increases your rewards by this percentage
          </p>
        </div>
      )}

      {/* Test Button */}
      <GeneralButton
        onClick={handleTestBurn}
        disabled={isPending || isConfirming}
        style={{
          width: '100%',
          marginBottom: '1rem',
          background: '#9333ea',
          opacity: isPending || isConfirming ? 0.5 : 1,
        }}
      >
        🧪 TEST: Burn Token 0
      </GeneralButton>

      <NFTSelector
        onSelect={setSelectedTokenId}
        selectedTokenId={selectedTokenId}
        mode="wallet"
        title="Select NFT from Wallet to Burn"
        key={refetchTrigger}
      />

      <div className="info-box" style={{
        background: 'rgba(255, 73, 74, 0.1)',
        border: '2px solid #FF494A',
        marginTop: '1rem'
      }}>
        <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#FF494A', margin: 0 }}>
          ⚠️ Warning
        </p>
        <p style={{ fontSize: '0.75rem', color: '#999999', marginTop: '0.5rem' }}>
          Burning your NFT is permanent and irreversible. The NFT will be destroyed, and you will enter burn mode to earn bonus rewards.
        </p>
      </div>

      <GeneralButton
        onClick={handleBurn}
        disabled={selectedTokenId === undefined || isPending || isConfirming}
        style={{
          width: '100%',
          marginTop: '1rem',
          background: selectedTokenId === undefined || isPending || isConfirming ? '#666666' : '#FF494A',
        }}
      >
        {isPending || isConfirming ? 'Burning...' : 'Burn NFT'}
      </GeneralButton>
    </div>
  );
}
