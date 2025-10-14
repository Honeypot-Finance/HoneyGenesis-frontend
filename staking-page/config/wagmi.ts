import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

// Berachain Bepolia Testnet
export const berachainTestnet = defineChain({
  id: 80069,
  name: "Berachain Bepolia",
  nativeCurrency: {
    decimals: 18,
    name: "BERA",
    symbol: "BERA",
  },
  rpcUrls: {
    default: {
      http: ["https://bepolia.rpc.berachain.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Berascan",
      url: "https://testnet.berascan.com",
    },
  },
  testnet: true,
});

// Berachain Mainnet (when launched)
export const berachainMainnet = defineChain({
  id: 80094, // Update this when mainnet launches
  name: "Berachain",
  nativeCurrency: {
    decimals: 18,
    name: "BERA",
    symbol: "BERA",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.berachain.com"], // Update when mainnet launches
    },
  },
  blockExplorers: {
    default: {
      name: "Berascan",
      url: "https://berascan.com", // Update when mainnet launches
    },
  },
  testnet: false,
});

export const config = getDefaultConfig({
  appName: "NFT Staking DApp",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [berachainTestnet, berachainMainnet],
  ssr: true,
});
