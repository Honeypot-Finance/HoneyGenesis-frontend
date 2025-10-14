import { Address } from 'viem';

export interface StakeData {
  owner: Address;
  stakedAt: bigint;
  lastClaimAt: bigint;
  burned: boolean;
  burnedAt: bigint;
  lastBurnClaimAt: bigint;
}

export interface NFTStakingParams {
  rewardRatePerSecond: bigint;
  burnBonusBps: bigint;
}

export interface NFTItem {
  tokenId: bigint;
  owner: Address;
  isApproved: boolean;
  tokenURI?: string;
}

export interface StakedNFT extends NFTItem {
  stakeData: StakeData;
  pendingRewards: bigint;
}

export interface RewardsInfo {
  balance: bigint;
  symbol: string;
  decimals: number;
}
