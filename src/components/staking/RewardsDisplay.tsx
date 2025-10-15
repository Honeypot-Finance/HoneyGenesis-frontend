import { useAccount, useChainId, useSwitchChain } from "wagmi";
import {
  useRewardsBalance,
  useRewardsTokenInfo,
} from "@/hooks/useRewardsToken";
import { useContractAddresses } from "@/hooks/useContractAddresses";
import { formatTokenAmount } from "@/lib/stakingUtils";
import { BERACHAIN_TESTNET } from "@/consts";
import GeneralButton from "../atoms/GeneralButton/GeneralButton";

export function RewardsDisplay() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { balance, isLoading, error } = useRewardsBalance(address);
  const { symbol, name, decimals } = useRewardsTokenInfo();
  const { rewardsAddress } = useContractAddresses();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isCorrectNetwork = chainId === BERACHAIN_TESTNET;

  const handleSwitchNetwork = () => {
    switchChain({ chainId: BERACHAIN_TESTNET });
  };

  const getExplorerUrl = (tokenAddress: string) => {
    return `https://bepolia.beratrail.io/address/${tokenAddress}`;
  };

  return (
    <div
      style={{
        borderRadius: "var(--border-radius)",
        padding: "2rem",
        border: "var(--border-size) solid #ffcd4d",
        background: "linear-gradient(135deg, #31220c 0%, #1a1410 100%)",
        boxShadow: "0 4px 24px rgba(255, 205, 77, 0.15)",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: "1rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#ffcd4d",
            margin: 0,
          }}
        >
          Your Rewards Balance
        </h2>
        {rewardsAddress && isCorrectNetwork && (
          <a
            href={getExplorerUrl(rewardsAddress)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "var(--border-radius-sm)",
              background: "rgba(247, 149, 29, 0.1)",
              border: "1px solid rgba(247, 149, 29, 0.3)",
              color: "#ffcd4d",
              fontSize: "0.75rem",
              fontWeight: "bold",
              textDecoration: "none",
              transition: "all 0.3s",
            }}
          >
            View Token ↗
          </a>
        )}
      </div>
      <div>
        {!isCorrectNetwork ? (
          <div>
            <p
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#FF494A",
                margin: "0.5rem 0",
              }}
            >
              Switch to Berachain Testnet
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#999999",
                margin: "0 0 1rem 0",
              }}
            >
              Staking is only available on Berachain Testnet (Chain ID:{" "}
              {BERACHAIN_TESTNET})
            </p>
            <GeneralButton
              onClick={handleSwitchNetwork}
              disabled={isSwitching}
              style={{
                background: "#f7941d",
                padding: "0.75rem 1.5rem",
                fontSize: "0.9rem",
              }}
            >
              {isSwitching ? "Switching..." : "Switch to Berachain"}
            </GeneralButton>
          </div>
        ) : error ? (
          <div>
            <p
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#FF494A",
                margin: "0.5rem 0",
              }}
            >
              Error loading balance
            </p>
            <p style={{ fontSize: "0.9rem", color: "#999999", margin: 0 }}>
              Please make sure you're connected to the correct network
            </p>
          </div>
        ) : balance !== undefined && decimals !== undefined ? (
          <div>
            <p
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "white",
                margin: "0.5rem 0",
              }}
            >
              {formatTokenAmount(balance, decimals, 6)} {symbol || "REWARD"}
            </p>
            <p style={{ fontSize: "0.9rem", color: "#999999", margin: 0 }}>
              {name || "Rewards Token"}
            </p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: "1.2rem", color: "#999999" }}>
              {isLoading ? "Loading..." : "0 REWARD"}
            </p>
            <p style={{ fontSize: "0.9rem", color: "#666666", margin: 0 }}>
              Connect to Berachain Testnet to see your rewards
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
