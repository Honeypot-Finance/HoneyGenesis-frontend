# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HoneyGenesis is a React NFT minting frontend application for the HoneyPot Finance ecosystem. Users can mint NFT bears ("pot" and "predator" types) on Arbitrum and Berachain networks with dynamic pricing and real-time blockchain interaction.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with HMR
npm run dev

# Build for production (TypeScript compilation + Vite build)
npm run build

# Lint TypeScript/TSX files
npm run lint

# Preview production build
npm run preview
```

## Environment Configuration

Create a `.env` file with:
```
# Controls whether minting page is locked
VITE_LOCK_MINT=true
```

## Architecture

### State Management Dual Pattern

The application uses **two distinct state management systems**:

1. **Redux Toolkit** (`src/config/redux/`)
   - `popUpSlice.ts` - Modal/popup notifications
   - `honeyPotMintSlice.ts` - NFT minting state
   - `marioSlice.js`, `obstacleSlice.js`, `engineSlice.js` - Mini-game state
   - Store configured in `store.ts`

2. **MobX** (`src/lib/NFT.ts`)
   - `nftStore` - NFT layer composition and customization
   - Used for complex NFT trait selection with constraints
   - Observable reactive state for bear type and layer management

### Web3 Integration

**Wagmi v2 + Web3Modal** for blockchain connectivity:
- Provider setup: `src/components/walletConnect/WalletConnectContextProvider.tsx`
- WalletConnect Project ID: `62b879a6f8477a3186d246bb4ebc33bf`
- Contract interactions via `useHoneyPot` hook (`src/hooks/useHoneyPot.ts`)

**Supported Networks** (configured in `src/consts.ts`):
- Arbitrum One (chainId: 42161)
- Arbitrum Sepolia (chainId: 421614)
- Berachain Testnet (chainId: 80085)

**Contract Addresses**:
- Arbitrum One: `0x7c2f99C405fa3102519F2637f186C5A06C074a0F`
- Arbitrum Sepolia: `0x4ccE6489B9063C39522F06532D6345572d2945c2`
- Berachain Testnet: `0x53B9fC0A0833f2A090bB92D4914430eEd4C0AAAC`

### Smart Contract Interface

ABI located at `src/abi/HoneyGenesis.json`. Key contract functions:
- `mint(amount)` - Public NFT minting with dynamic pricing
- `getCurrentPrice()` - Fetch current mint price
- `getNextNFTPrice()` - Get next tier price
- `tokenCountNormal` - Minted supply counter
- `TOTAL_SUPPLY_CAP` - Max supply
- VIP functions: `getVIPPrice()`, `getVIPMintQuota(address)`, `tokenCountVIP`

**Pricing Logic**:
- Base NFT price + 3% commission + 0.0009 ETH Kingdomly fee per NFT
- Calculated in `useHoneyPot` hook: `getTotalPriceWithFee(vip, mintAmount)`

### NFT Layer System

The NFT composition system (`src/lib/NFT.ts`) supports:
- 9 layers: Background, Bear, Nail, Emotion, Cloth, Hat, Glasses, Smoke, Handhold
- Two bear types: "pot" and "predator"
- Layer constraints system preventing incompatible trait combinations
- Assets stored in `src/assets/nft/` (large) and `src/assets/nft_sm/` (small thumbnails)

**Key NFT Methods**:
- `setBearType(type)` - Switch between pot/predator
- `setLayer(layer, name)` - Update specific layer trait
- `updateConstraints()` - Recalculate valid trait combinations
- `randomNFT()` - Generate random NFT respecting constraints

### Routing Structure

React Router v6 configuration in `src/router.tsx`:
- `/` - Homepage with mint countdown
- `/mint` - Main public minting interface
- `/v123i4p5-m1i2n3t4` - VIP minting (obfuscated URL)
- `/my-assets` - User's owned NFTs
- `/whitelist-check` - Whitelist verification
- `/reveal` - NFT reveal page
- `/terms` - Terms of service

### Component Structure

**Atomic Design Pattern**:
- `atoms/` - Basic inputs, buttons, containers (GeneralButton, NumberInput, PopUp)
- `molecules/` - Composed components (QuantityInput, CountDown, MintedDisplay)
- `template/` - Page layouts (MainContentWrapper)

**Key Components**:
- `MintNFTButton.tsx` - Reusable mint trigger with wallet connection check
- `WalletConnectConnectButton.tsx` - Web3Modal wallet connection
- `HoneyDropEffect.tsx` - Minting animation effects
- `Game.tsx` - Mini-game embedded on mint page

### TypeScript Configuration

Path aliases configured via `tsconfig.json`:
```typescript
"@/*" -> "src/*"
```
Examples: `@/hooks/useHoneyPot`, `@/config/redux/store`

Vite uses `vite-tsconfig-paths` plugin to resolve these aliases.

## Critical Implementation Notes

1. **Transaction Error Handling** (`src/Routes/Mint.tsx:171-219`)
   - User rejection: Show friendly "Transaction Rejected" popup
   - Insufficient funds: Auto-retry after refetching on-chain data
   - Exceeds supply cap: Specific VIP supply error handling
   - Insufficient wallet balance: Prompt user to add funds

2. **Mint Success Pattern**
   - Store transaction hash in `previousData` to prevent duplicate success popups
   - Refetch contract data 1 second after successful mint
   - Display transaction hash in success notification

3. **Dynamic Pricing Updates**
   - Price increases after each mint tier
   - Always refetch `getCurrentPrice()`, `getNextPrice()`, `getMintedAmount()` after transactions
   - Display "Sold Out" when `mintedAmount >= maxAmount`

4. **Chain-Specific Logic**
   - Currency unit differs: ETH (Arbitrum) vs BERA (Berachain)
   - Contract addresses resolved via `contracts[currentChainId]` mapping
   - Users must be on accepted chains (42161, 421614, 80085)

## Build Configuration

**Vite Setup** (`vite.config.ts`):
- React Fast Refresh via `@vitejs/plugin-react`
- Image optimization with `vite-plugin-image-optimizer`
- Output directory: `build/` (not default `dist/`)

**Linting**:
- ESLint with TypeScript parser
- Max warnings: 0 (strict mode)
- Ignore unused disable directives

## Common Patterns

### Reading Contract Data
```typescript
const { data, error, isPending } = useReadContract({
  abi: HoneyGenesis.abi,
  chainId: currentChainId,
  functionName: 'functionName',
  address: contracts[currentChainId],
  args: [arg1, arg2]
});
```

### Writing Contract Transactions
```typescript
const { writeContract } = useWriteContract();

writeContract({
  abi: HoneyGenesis.abi,
  chainId: currentChainId,
  functionName: 'mint',
  address: contracts[currentChainId],
  args: [amount],
  value: BigInt(etherToWei(totalPrice))
});
```

### Currency Conversion
```typescript
import { etherToWei, weiToEther } from '@/lib/currencyConvert';

// Always convert to Wei before sending transactions
value: BigInt(etherToWei(priceInEther))

// Convert Wei to Ether for display
weiToEther(parseInt(priceInWei)).toPrecision(2)
```

## Testing Strategy

No test framework currently configured. When adding tests:
- Consider Jest + React Testing Library for components
- Use Wagmi's testing utilities for contract interaction mocks
- Test wallet connection flows and transaction error states
