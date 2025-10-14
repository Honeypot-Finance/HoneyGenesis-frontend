import { GraphQLClient } from 'graphql-request';

// NFT Staking subgraph with staking information
const STAKING_SUBGRAPH_URL = 'https://api.goldsky.com/api/public/project_cm78242tjtmme01uvcbkaay27/subgraphs/nft-staking-berachainBepolia/1.0.0/gn';

// NFT Tracker subgraph for NFT ownership
const NFT_TRACKER_SUBGRAPH_URL = 'https://api.goldsky.com/api/public/project_cm78242tjtmme01uvcbkaay27/subgraphs/nft-tracker-berachainBepolia/1.0.0/gn';

export const stakingGraphqlClient = new GraphQLClient(STAKING_SUBGRAPH_URL);
export const nftGraphqlClient = new GraphQLClient(NFT_TRACKER_SUBGRAPH_URL);

// Default client for backward compatibility
export const graphqlClient = stakingGraphqlClient;
