import { useAccount, useChainId, useSwitchChain } from "wagmi";
import {
  useRewardsBalance,
  useRewardsTokenInfo,
} from "@/hooks/useRewardsToken";
import { useContractAddresses } from "@/hooks/useContractAddresses";
import { formatTokenAmount } from "@/lib/stakingUtils";
import { DEFAULT_STAKING_CHAIN_ID } from "@/consts";
import GeneralButton from "../atoms/GeneralButton/GeneralButton";

export function RewardsDisplay() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { balance, isLoading, error } = useRewardsBalance(address);
  const { symbol, name, decimals } = useRewardsTokenInfo();
  const { rewardsAddress } = useContractAddresses();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isCorrectNetwork = chainId === DEFAULT_STAKING_CHAIN_ID;

  const handleSwitchNetwork = () => {
    switchChain({ chainId: DEFAULT_STAKING_CHAIN_ID });
  };

  const getExplorerUrl = (tokenAddress: string) => {
    return `https://berascan.com/address/${tokenAddress}`;
  };

  const burnTokenUrl =
    "https://leaderboard.honeypotfinance.xyz/all-in-one-vault?selectburntoken=0xa32bfaf94e37911d08531212d32eade94389243b";

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
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#ffcd4d",
          margin: "0 0 1.5rem 0",
        }}
      >
        Your Rewards Balance
      </h2>

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
              Switch to Berachain
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#999999",
                margin: "0 0 1rem 0",
              }}
            >
              Staking is only available on Berachain (Chain ID:{" "}
              {DEFAULT_STAKING_CHAIN_ID})
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
            <p
              style={{
                fontSize: "0.9rem",
                color: "#999999",
                margin: "0 0 1.5rem 0",
              }}
            >
              {name || "Rewards Token"}
            </p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: "1.2rem", color: "#999999" }}>
              {isLoading ? "Loading..." : "0 REWARD"}
            </p>
            <p style={{ fontSize: "0.9rem", color: "#666666", margin: 0 }}>
              Connect to Berachain to see your rewards
            </p>
          </div>
        )}
      </div>

      {isCorrectNetwork && (
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          <a
            href={burnTokenUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              padding: "1rem 1.5rem",
              borderRadius: "var(--border-radius-sm)",
              background: "linear-gradient(135deg, #f7941d 0%, #ff9f1c 100%)",
              border: "2px solid #ffb347",
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
              textDecoration: "none",
              transition: "all 0.3s",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(247, 148, 29, 0.4)",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(247, 148, 29, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(247, 148, 29, 0.4)";
            }}
          >
            <span>Burn Tokens in AIOV</span>
          </a>
          {rewardsAddress && (
            <a
              href={getExplorerUrl(rewardsAddress)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "1rem 1.25rem",
                borderRadius: "var(--border-radius-sm)",
                background: "rgba(247, 149, 29, 0.1)",
                border: "2px solid rgba(247, 149, 29, 0.3)",
                color: "#ffcd4d",
                fontSize: "0.875rem",
                fontWeight: "bold",
                textDecoration: "none",
                transition: "all 0.3s",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(247, 149, 29, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(247, 149, 29, 0.1)";
              }}
            >
              View Token ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}
