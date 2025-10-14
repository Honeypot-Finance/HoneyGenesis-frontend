import { gql } from 'graphql-request';

/**
 * Query to get all NFTs owned by a specific address
 * Uses the NFT Tracker subgraph schema
 */
export const GET_USER_NFTS = gql`
  query GetUserNFTs($owner: String!) {
    nfttokens(
      where: {
        owner_: { address: $owner }
      }
      orderBy: tokenId
      orderDirection: asc
      first: 1000
    ) {
      id
      tokenId
      owner {
        address
      }
      contract {
        id
      }
    }
  }
`;

/**
 * Query to get all NFTs owned by a specific address (wallet NFTs)
 * Uses the updated NFT Staking subgraph with NFT tracking
 */
export const GET_USER_WALLET_NFTS = gql`
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
export const GET_USER_STAKES = gql`
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
export const GET_USER_BURNABLE_STAKES = gql`
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

/**
 * Query to get all stakes (including burned and unstaked)
 */
export const GET_ALL_USER_STAKES = gql`
  query GetAllUserStakes($owner: String!) {
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
 * Query to get NFT details by token ID
 */
export const GET_NFT_BY_ID = gql`
  query GetNFTById($tokenId: String!, $nftContract: String!) {
    nfttokens(
      where: {
        tokenId: $tokenId
        contract_: { id: $nftContract }
      }
    ) {
      id
      tokenId
      owner {
        address
      }
      contract {
        id
      }
    }
  }
`;

/**
 * Query to get all tokens for a contract
 */
export const GET_ALL_TOKENS = gql`
  query GetAllTokens($nftContract: String!, $first: Int!, $skip: Int!) {
    nfttokens(
      where: { contract_: { id: $nftContract } }
      first: $first
      skip: $skip
      orderBy: tokenId
      orderDirection: asc
    ) {
      id
      tokenId
      owner {
        address
      }
      contract {
        id
      }
    }
  }
`;
