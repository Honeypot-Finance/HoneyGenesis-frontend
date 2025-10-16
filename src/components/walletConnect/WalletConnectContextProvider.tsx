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
  id: 80094,
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

// Define Berachain bArtio Testnet
const berachainBartio = defineChain({
  id: 80084,
  name: 'Berachain bArtio',
  nativeCurrency: {
    decimals: 18,
    name: 'BERA',
    symbol: 'BERA',
  },
  rpcUrls: {
    default: {
      http: ['https://bartio.rpc.berachain.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Beratrail',
      url: 'https://bartio.beratrail.io',
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
  berachainBartio,
] as const;

// Explicitly configure transports with correct RPC endpoints
const config = createConfig({
  chains,
  transports: {
    [arbitrum.id]: http(),
    [berachainMainnet.id]: http('https://rpc.berachain.com', {
      batch: true,
      retryCount: 3,
    }),
    [berachainBartio.id]: http('https://bartio.rpc.berachain.com', {
      batch: true,
      retryCount: 3,
    }),
  },
  connectors: [
    walletConnect({ projectId, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({ appName: metadata.name }),
  ],
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
