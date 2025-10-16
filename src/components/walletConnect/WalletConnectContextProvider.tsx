import { createWeb3Modal } from "@web3modal/wagmi/react";
import { createConfig, http } from "wagmi";

import { WagmiProvider } from "wagmi";
import {
  arbitrum,
  //arbitrumSepolia,
  // mainnet
} from "wagmi/chains";
import { defineChain } from 'viem';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "62b879a6f8477a3186d246bb4ebc33bf";

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Define Berachain Mainnet
const berachainMainnet = defineChain({
  id: 80084,
  name: 'Berachain',
  nativeCurrency: {
    decimals: 18,
    name: 'BERA',
    symbol: 'BERA',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.berachain.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Berascan',
      url: 'https://berascan.com',
    },
  },
  testnet: false,
});

// Define Berachain Bepolia Testnet (for staking)
const berachainBepolia = defineChain({
  id: 80069,
  name: 'Berachain Bepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'BERA',
    symbol: 'BERA',
  },
  rpcUrls: {
    default: {
      http: ['https://bepolia.rpc.berachain.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Berascan',
      url: 'https://testnet.berascan.com',
    },
  },
  testnet: true,
});

// Put mainnet before testnet to ensure it's the default
const chains = [
  //mainnet,
  arbitrum,
  //arbitrumSepolia,
  berachainMainnet,
  berachainBepolia,
] as const;

// Explicitly configure transports with correct RPC endpoints
const config = createConfig({
  chains,
  transports: {
    [arbitrum.id]: http(),
    [berachainMainnet.id]: http('https://rpc.berachain.com'),
    [berachainBepolia.id]: http('https://bepolia.rpc.berachain.com'),
  },
  connectors: [
    walletConnect({ projectId, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({ appName: metadata.name }),
  ],
});

// Log chain configuration for debugging
console.log('Wagmi chains configured:', chains.map(c => ({ id: c.id, name: c.name })));
console.log('Wagmi transports:', {
  [arbitrum.id]: 'default',
  [berachainMainnet.id]: 'https://rpc.berachain.com',
  [berachainBepolia.id]: 'https://bepolia.rpc.berachain.com',
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export default function WalletConnectContextProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
