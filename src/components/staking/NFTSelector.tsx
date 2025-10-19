import { useAccount } from 'wagmi';
import { useUserNFTs } from '@/hooks/useUserNFTs';
import { useImperativeHandle, forwardRef, useRef } from 'react';

interface NFTSelectorProps {
  onSelect: (tokenId: bigint) => void;
  selectedTokenId?: bigint;
  mode?: 'wallet' | 'staked' | 'burnable' | 'all-burnable';
  title?: string;
}

export interface NFTSelectorRef {
  refetch: () => Promise<void>;
}

export const NFTSelector = forwardRef<NFTSelectorRef, NFTSelectorProps>(
  ({ onSelect, selectedTokenId, mode = 'wallet', title }, ref) => {
    const { isConnected } = useAccount();
    const { nfts, isLoading, hasNFTs, refetch } = useUserNFTs(mode);

    // Expose refetch function to parent via ref
    useImperativeHandle(ref, () => ({
      refetch,
    }));

  if (!isConnected) {
    return (
      <div className="info-box" style={{
        background: 'rgba(247, 149, 29, 0.1)',
        border: '2px solid var(--border-color)'
      }}>
        <p style={{ color: '#ffcd4d', margin: 0 }}>
          Connect your wallet to see your NFTs
        </p>
      </div>
    );
  }

  const handleSelectNFT = (tokenId: string) => {
    onSelect(BigInt(tokenId));
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ color: '#ffcd4d', fontSize: '1.2rem', marginBottom: '1rem' }}>
        {title || (mode === 'wallet' ? 'Your NFTs' : mode === 'all-burnable' ? 'Your Burnable NFTs' : 'Your Staked NFTs')}
      </h3>

      {isLoading ? (
        <div className="info-box">
          <p style={{ color: '#999999', margin: 0 }}>Loading your NFTs...</p>
        </div>
      ) : hasNFTs ? (
        <div>
          <p style={{ color: '#999999', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {mode === 'wallet' ? 'Select an NFT from your wallet:' : mode === 'all-burnable' ? 'Select an NFT to burn (staked or unstaked):' : 'Select a staked NFT:'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
            {nfts.map((nft) => (
              <NFTCard
                key={nft.id}
                tokenId={nft.tokenId}
                isSelected={selectedTokenId?.toString() === nft.tokenId}
                onSelect={() => handleSelectNFT(nft.tokenId)}
                isStaked={nft.isStaked}
                burned={nft.burned}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="info-box">
          <p style={{ color: '#999999', margin: 0 }}>
            {mode === 'wallet'
              ? 'No NFTs found in your wallet.'
              : mode === 'all-burnable'
              ? 'No burnable NFTs found.'
              : 'No staked NFTs found.'}
          </p>
        </div>
      )}

      {selectedTokenId !== undefined && (
        <div className="info-box" style={{
          marginTop: '1rem',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid #10B981'
        }}>
          <p style={{ color: '#10B981', margin: 0 }}>
            Selected Token ID: <strong>#{selectedTokenId.toString()}</strong>
          </p>
        </div>
      )}
    </div>
  );
});

function NFTCard({ tokenId, isSelected, onSelect, isStaked, burned }: {
  tokenId: string;
  isSelected: boolean;
  onSelect: () => void;
  isStaked?: boolean;
  burned?: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        padding: '1rem',
        background: isSelected ? 'rgba(247, 149, 29, 0.2)' : '#31220c',
        border: isSelected ? '3px solid #ffcd4d' : '2px solid var(--border-color)',
        borderRadius: 'var(--border-radius-sm)',
        cursor: 'pointer',
        transition: 'all 0.3s',
        color: 'white',
        fontFamily: '"inter black", sans-serif',
        textAlign: 'left',
        boxShadow: isSelected ? '0 0 20px rgba(255, 205, 77, 0.3)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#ffcd4d';
          e.currentTarget.style.background = 'rgba(247, 149, 29, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.background = '#31220c';
        }
      }}
    >
      <div style={{ fontWeight: 'bold', color: '#ffcd4d' }}>Token #{tokenId}</div>
      {burned ? (
        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#FF494A', fontWeight: 'bold' }}>
          🔥 Burned
        </div>
      ) : isStaked ? (
        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#10B981', fontWeight: 'bold' }}>
          ✓ Staked
        </div>
      ) : null}
    </button>
  );
}
