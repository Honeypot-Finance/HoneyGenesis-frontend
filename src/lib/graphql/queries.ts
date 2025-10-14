/**
 * Query to get all NFTs owned by a specific address (wallet NFTs)
 * Uses the updated NFT Staking subgraph with NFT tracking
 */
export const GET_USER_WALLET_NFTS = `
  query GetUserWalletNFTs($owner: String!) {
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
 * Query to get all staked NFTs for a specific address
 * Uses the NFT Staking subgraph schema
 */
export const GET_USER_STAKES = `
  query GetUserStakes($owner: String!) {
    stakes(
      where: {
        ownerAddress: $owner
        status: STAKED
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
        status: STAKED
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
