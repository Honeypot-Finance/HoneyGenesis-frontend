// NFT Staking subgraph with staking information
const STAKING_SUBGRAPH_URL =
  "https://api.goldsky.com/api/public/project_cm78242tjtmme01uvcbkaay27/subgraphs/nft-staking-berachain/1.1.0/gn";

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

  /**
   * Fetches all records by automatically paginating through results in batches of 1000.
   * Continues fetching until a batch returns less than 1000 items.
   *
   * @param query - The GraphQL query string (must support $skip parameter)
   * @param variables - Query variables (skip parameter will be added automatically)
   * @param dataKey - The key in the response data that contains the array of items (e.g., "stakes", "nfts")
   * @returns Promise containing all fetched items
   */
  async requestPaginated<T = any>(
    query: string,
    variables: Record<string, any>,
    dataKey: string
  ): Promise<T[]> {
    const BATCH_SIZE = 1000;
    let allItems: T[] = [];
    let skip = 0;
    let hasMore = true;

    console.log(`Starting paginated fetch for ${dataKey}...`);

    while (hasMore) {
      const batchVariables = { ...variables, skip };
      const response = await this.request<Record<string, T[]>>(query, batchVariables);
      const items = response[dataKey] || [];

      console.log(`Fetched batch: skip=${skip}, received=${items.length} items`);

      allItems = [...allItems, ...items];

      // If we got less than BATCH_SIZE items, we've reached the end
      if (items.length < BATCH_SIZE) {
        hasMore = false;
      } else {
        skip += BATCH_SIZE;
      }
    }

    console.log(`Pagination complete. Total ${dataKey} fetched: ${allItems.length}`);
    return allItems;
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
