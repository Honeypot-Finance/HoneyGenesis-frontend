import { graphqlClient } from './client';
import { GET_USER_NFTS } from './queries';

/**
 * Test function to query the subgraph
 * Run this in the browser console to debug
 */
export async function testSubgraphQuery(owner: string) {
  console.log('Testing subgraph query...');
  console.log('Owner:', owner);

  try {
    const data = await graphqlClient.request(GET_USER_NFTS, {
      owner: owner.toLowerCase(),
    });

    console.log('Query successful!');
    console.log('Data:', data);
    return data;
  } catch (error) {
    console.error('Query failed:', error);
    throw error;
  }
}

// Export for browser console access
if (typeof window !== 'undefined') {
  (window as any).testSubgraphQuery = testSubgraphQuery;
}
