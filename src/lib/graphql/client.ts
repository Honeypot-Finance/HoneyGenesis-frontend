// NFT Staking subgraph with staking information
const STAKING_SUBGRAPH_URL =
  "https://api.goldsky.com/api/public/project_cm78242tjtmme01uvcbkaay27/subgraphs/nft-staking-berachain/1.0.2/gn";

// NFT Tracker subgraph for NFT ownership (using same endpoint for now)
const NFT_TRACKER_SUBGRAPH_URL =
  "https://api.goldsky.com/api/public/project_cm78242tjtmme01uvcbkaay27/subgraphs/honeygenesis-berachain/1.0.2/gn";

interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
}

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{ message: string }>;
}

class SimpleGraphQLClient {
  constructor(private url: string) {}

  async request<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      } as GraphQLRequest),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    const result: GraphQLResponse<T> = await response.json();

    if (result.errors && result.errors.length > 0) {
      throw new Error(`GraphQL error: ${result.errors[0].message}`);
    }

    return result.data as T;
  }
}

export const stakingGraphqlClient = new SimpleGraphQLClient(
  STAKING_SUBGRAPH_URL
);
export const nftGraphqlClient = new SimpleGraphQLClient(
  NFT_TRACKER_SUBGRAPH_URL
);

// Default client for backward compatibility
export const graphqlClient = stakingGraphqlClient;
