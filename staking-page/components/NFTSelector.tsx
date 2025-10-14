'use client';

import { useAccount } from 'wagmi';
import { useNFTsFromSubgraph } from '@/hooks/useNFTsFromSubgraph';

interface NFTSelectorProps {
  onSelect: (tokenId: bigint) => void;
  selectedTokenId?: bigint;
  mode?: 'wallet' | 'staked' | 'burnable';
  title?: string;
}

export function NFTSelector({ onSelect, selectedTokenId, mode = 'wallet', title }: NFTSelectorProps) {
  const { isConnected } = useAccount();
  const { nfts, isLoading, hasNFTs } = useNFTsFromSubgraph(mode);

  if (!isConnected) {
    return (
      <div className="rounded-xl border p-4" style={{
        background: 'rgba(245, 158, 11, 0.1)',
        borderColor: '#F59E0B'
      }}>
        <p className="text-sm" style={{ color: '#F59E0B' }}>
          Connect your wallet to see your NFTs
        </p>
      </div>
    );
  }

  const handleSelectNFT = (tokenId: string) => {
    onSelect(BigInt(tokenId));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: '#ffffff' }}>
        {title || (mode === 'wallet' ? 'Your NFTs' : 'Your Staked NFTs')}
      </h3>

      {isLoading ? (
        <div className="rounded-xl border p-4 text-center" style={{
          background: '#1a1410',
          borderColor: 'rgba(245, 158, 11, 0.2)'
        }}>
          <p className="text-sm" style={{ color: '#999999' }}>Loading your NFTs...</p>
        </div>
      ) : hasNFTs ? (
        <div className="space-y-2">
          <p className="text-sm" style={{ color: '#999999' }}>
            {mode === 'wallet' ? 'Select an NFT from your wallet:' : 'Select a staked NFT:'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
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
        <div className="rounded-xl border p-4" style={{
          background: '#1a1410',
          borderColor: 'rgba(245, 158, 11, 0.2)'
        }}>
          <p className="text-sm" style={{ color: '#999999' }}>
            {mode === 'wallet'
              ? 'No NFTs found in your wallet.'
              : 'No staked NFTs found.'}
          </p>
        </div>
      )}

      {selectedTokenId !== undefined && (
        <div className="p-3 rounded-xl border" style={{
          background: 'rgba(16, 185, 129, 0.1)',
          borderColor: '#10B981'
        }}>
          <p className="text-sm" style={{ color: '#10B981' }}>
            Selected Token ID: <span className="font-bold">#{selectedTokenId.toString()}</span>
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * NFT Card component for displaying individual NFT
 */
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
      className="p-3 border-2 rounded-xl text-left transition-all"
      style={{
        background: isSelected ? 'rgba(245, 158, 11, 0.1)' : '#1a1410',
        borderColor: isSelected ? '#F59E0B' : 'rgba(245, 158, 11, 0.2)',
        boxShadow: isSelected ? '0 0 12px rgba(245, 158, 11, 0.3)' : 'none'
      }}
      onMouseOver={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
        }
      }}
      onMouseOut={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.2)';
        }
      }}
    >
      <div className="font-medium text-sm" style={{ color: '#ffffff' }}>Token #{tokenId}</div>
      {isStaked && (
        <div className="text-xs mt-1 font-semibold" style={{ color: '#10B981' }}>
          ✓ Staked
        </div>
      )}
      {burned && (
        <div className="text-xs mt-1 font-semibold" style={{ color: '#FF494A' }}>
          🔥 Burned
        </div>
      )}
    </button>
  );
}
