import { useAccount } from 'wagmi';

/**
 * Development mode mock address
 * This address is used for testing when VITE_DEV=true
 */
const DEV_MOCK_ADDRESS = '0x368306769f6740e743f99f2f690446b3da668ad9' as const;

/**
 * Custom hook that wraps wagmi's useAccount with dev mode support.
 * When VITE_DEV=true, it returns a mock address for testing.
 *
 * Usage: Replace `useAccount()` with `useDevAccount()` in components/hooks that need dev testing.
 */
export function useDevAccount() {
  const account = useAccount();
  const isDev = import.meta.env.VITE_DEV === 'true';

  if (isDev) {
    console.log('🔧 DEV MODE: Using mock wallet address:', DEV_MOCK_ADDRESS);
    return {
      ...account,
      address: DEV_MOCK_ADDRESS as `0x${string}`,
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      isReconnecting: false,
    };
  }

  return account;
}
