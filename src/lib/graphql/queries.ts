/**
 * Query to get all NFTs owned by a specific address (wallet NFTs)
 * Query both nfts and stakes entities to handle all cases
 */
export const GET_USER_WALLET_NFTS = `
  query GetUserWalletNFTs($owner: String!) {
    # Query NFT entities (if subgraph tracks them)
    nfts(
      where: {
        ownerAddress: $owner
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
    ) {
      id
      contract
      tokenId
      ownerAddress
      isStaked
      isBurned
    }
    # Also query stakes with UNSTAKED status as backup
    stakes(
      where: {
        ownerAddress: $owner
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
    ) {
      id
      tokenId
      ownerAddress
      status
      burned
    }
  }
`;

/**
 * Query to get all staked NFTs for a specific address
 * Uses the NFT Staking subgraph schema
 */
export const GET_USER_STAKES = `
  query GetUserStakes($owner: String!) {
    stakes(
      where: {
        ownerAddress: $owner
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
    ) {
      id
      tokenId
      ownerAddress
      stakedAt
      lastClaimAt
      burned
      burnedAt
      lastBurnClaimAt
      status
      totalRewardsClaimed
      totalBurnRewardsClaimed
    }
  }
`;

/**
 * Query to get staked NFTs that are not yet burned (for burning)
 * Uses the NFT Staking subgraph schema
 */
export const GET_USER_BURNABLE_STAKES = `
  query GetUserBurnableStakes($owner: String!) {
    stakes(
      where: {
        ownerAddress: $owner
        burned: false
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
    ) {
      id
      tokenId
      ownerAddress
      stakedAt
      lastClaimAt
      burned
      burnedAt
      lastBurnClaimAt
      status
      totalRewardsClaimed
      totalBurnRewardsClaimed
    }
  }
`;

/**
 * Query to get all NFTs (both staked and unstaked) that can be burned
 * Combines staked NFTs and wallet NFTs
 */
export const GET_USER_ALL_BURNABLE_NFTS = `
  query GetUserAllBurnableNFTs($owner: String!) {
    # Get staked NFTs that aren't burned
    stakes(
      where: {
        ownerAddress: $owner
        burned: false
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
    ) {
      id
      tokenId
      ownerAddress
      stakedAt
      lastClaimAt
      burned
      status
    }
    # Get wallet NFTs (unstaked)
    nfts(
      where: {
        ownerAddress: $owner
        isStaked: false
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
    ) {
      id
      contract
      tokenId
      ownerAddress
      isStaked
      isBurned
    }
  }
`;

/**
 * Query to get all NFTs that can claim rewards
 * Includes: all staked NFTs + burned NFTs (even if not staked)
 */
export const GET_USER_CLAIMABLE_NFTS = `
  query GetUserClaimableNFTs($owner: String!) {
    # Get all staked NFTs (both burned and not burned)
    stakes(
      where: {
        ownerAddress: $owner
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
    ) {
      id
      tokenId
      ownerAddress
      stakedAt
      lastClaimAt
      burned
      burnedAt
      lastBurnClaimAt
      status
      totalRewardsClaimed
      totalBurnRewardsClaimed
    }
    # Get burned NFTs that are not staked
    nfts(
      where: {
        ownerAddress: $owner
        isBurned: true
        isStaked: false
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
    ) {
      id
      contract
      tokenId
      ownerAddress
      isStaked
      isBurned
    }
  }
`;
