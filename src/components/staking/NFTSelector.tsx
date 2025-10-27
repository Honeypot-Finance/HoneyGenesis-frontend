import { useAccount } from 'wagmi';
import { useUserNFTs } from '@/hooks/useUserNFTs';
import { useImperativeHandle, forwardRef, useState } from 'react';

interface NFTSelectorProps {
  onSelect: (tokenId: bigint) => void;
  selectedTokenId?: bigint;
  mode?: 'wallet' | 'staked' | 'burnable' | 'all-burnable' | 'claimable';
  title?: string;
  // Multi-select props
  multiSelect?: boolean;
  selectedTokenIds?: bigint[];
  onMultiSelect?: (tokenIds: bigint[]) => void;
}

export interface NFTSelectorRef {
  refetch: () => Promise<void>;
}

export const NFTSelector = forwardRef<NFTSelectorRef, NFTSelectorProps>(
  ({ onSelect, selectedTokenId, mode = 'wallet', title, multiSelect = false, selectedTokenIds = [], onMultiSelect }, ref) => {
    const { isConnected } = useAccount();
    const { nfts, isLoading, hasNFTs, refetch } = useUserNFTs(mode);
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

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

  const handleSelectNFT = (tokenId: string, index: number, shiftKey: boolean) => {
    if (multiSelect && onMultiSelect) {
      const tokenIdBigInt = BigInt(tokenId);
      const isAlreadySelected = selectedTokenIds.some(id => id === tokenIdBigInt);

      // Handle shift-click for range selection
      if (shiftKey && lastSelectedIndex !== null && lastSelectedIndex !== index) {
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);
        const rangeTokenIds = nfts.slice(start, end + 1).map(nft => BigInt(nft.tokenId));

        // Combine existing selections with range
        const newSelection = [...selectedTokenIds];
        rangeTokenIds.forEach(id => {
          if (!newSelection.some(existingId => existingId === id)) {
            newSelection.push(id);
          }
        });

        onMultiSelect(newSelection);
        setLastSelectedIndex(index);
      } else {
        // Normal click behavior
        if (isAlreadySelected) {
          // Remove from selection
          onMultiSelect(selectedTokenIds.filter(id => id !== tokenIdBigInt));
        } else {
          // Add to selection
          onMultiSelect([...selectedTokenIds, tokenIdBigInt]);
        }
        setLastSelectedIndex(index);
      }
    } else {
      onSelect(BigInt(tokenId));
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ color: '#ffcd4d', fontSize: '1.2rem', marginBottom: '1rem' }}>
        {title || (
          mode === 'wallet' ? 'Your NFTs' :
          mode === 'all-burnable' ? 'Your Burnable NFTs' :
          mode === 'claimable' ? 'Your Claimable NFTs' :
          'Your Staked NFTs'
        )}
      </h3>

      {isLoading ? (
        <div className="info-box">
          <p style={{ color: '#999999', margin: 0 }}>Loading your NFTs...</p>
        </div>
      ) : hasNFTs ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p style={{ color: '#999999', fontSize: '0.9rem', margin: 0 }}>
              {multiSelect
                ? `Select multiple NFTs (${selectedTokenIds.length} selected) - Hold Shift to select range`
                : mode === 'wallet' ? 'Select an NFT from your wallet:' :
                  mode === 'all-burnable' ? 'Select an NFT to burn (staked or unstaked):' :
                  mode === 'claimable' ? 'Select NFTs to claim rewards from:' :
                  'Select a staked NFT:'}
            </p>
            {multiSelect && onMultiSelect && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    const allTokenIds = nfts.map(nft => BigInt(nft.tokenId));
                    onMultiSelect(allTokenIds);
                  }}
                  style={{
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: '#ffcd4d',
                    background: 'transparent',
                    border: '1.5px solid rgba(255, 205, 77, 0.4)',
                    borderRadius: 'var(--border-radius-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: '"inter black", sans-serif',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 205, 77, 0.1)';
                    e.currentTarget.style.borderColor = '#ffcd4d';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255, 205, 77, 0.4)';
                  }}
                >
                  Select All ({nfts.length})
                </button>
                <button
                  onClick={() => onMultiSelect([])}
                  disabled={selectedTokenIds.length === 0}
                  style={{
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: selectedTokenIds.length === 0 ? '#666666' : '#999999',
                    background: 'transparent',
                    border: '1.5px solid rgba(153, 153, 153, 0.3)',
                    borderRadius: 'var(--border-radius-sm)',
                    cursor: selectedTokenIds.length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: '"inter black", sans-serif',
                    opacity: selectedTokenIds.length === 0 ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTokenIds.length > 0) {
                      e.currentTarget.style.background = 'rgba(153, 153, 153, 0.1)';
                      e.currentTarget.style.borderColor = '#999999';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTokenIds.length > 0) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(153, 153, 153, 0.3)';
                    }
                  }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
            {nfts.map((nft, index) => (
              <NFTCard
                key={nft.id}
                tokenId={nft.tokenId}
                isSelected={multiSelect
                  ? selectedTokenIds.some(id => id.toString() === nft.tokenId)
                  : selectedTokenId?.toString() === nft.tokenId}
                onSelect={(shiftKey: boolean) => handleSelectNFT(nft.tokenId, index, shiftKey)}
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
              : mode === 'claimable'
              ? 'No claimable NFTs found.'
              : 'No staked NFTs found.'}
          </p>
        </div>
      )}

      {multiSelect && selectedTokenIds.length > 0 && (
        <div className="info-box" style={{
          marginTop: '1rem',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid #10B981'
        }}>
          <p style={{ color: '#10B981', margin: 0 }}>
            Selected: <strong>{selectedTokenIds.length} NFT{selectedTokenIds.length > 1 ? 's' : ''}</strong>
            {selectedTokenIds.length <= 5 && (
              <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                (#{selectedTokenIds.map(id => id.toString()).join(', #')})
              </span>
            )}
          </p>
        </div>
      )}
      {!multiSelect && selectedTokenId !== undefined && (
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
  onSelect: (shiftKey: boolean) => void;
  isStaked?: boolean;
  burned?: boolean;
}) {
  return (
    <button
      onClick={(e) => onSelect(e.shiftKey)}
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
