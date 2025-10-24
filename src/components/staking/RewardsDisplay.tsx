import { useAccount, useChainId, useSwitchChain } from "wagmi";
import {
  useRewardsBalance,
  useRewardsTokenInfo,
} from "@/hooks/useRewardsToken";
import { useContractAddresses } from "@/hooks/useContractAddresses";
import { formatTokenAmount } from "@/lib/stakingUtils";
import { DEFAULT_STAKING_CHAIN_ID } from "@/consts";
import GeneralButton from "../atoms/GeneralButton/GeneralButton";
import { useUserNFTs } from "@/hooks/useUserNFTs";
import { useMultiPreviewPayout } from "@/hooks/useNFTStaking";

export function RewardsDisplay() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { balance, isLoading, error } = useRewardsBalance(address);
  const { symbol, name, decimals } = useRewardsTokenInfo();
  const { rewardsAddress } = useContractAddresses();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isCorrectNetwork = chainId === DEFAULT_STAKING_CHAIN_ID;

  // Fetch claimable NFTs (staked and burned)
  const { nfts: claimableNFTs } = useUserNFTs("claimable");

  // Get token IDs and calculate total unclaimed rewards
  const claimableTokenIds = claimableNFTs.map((nft) => BigInt(nft.tokenId));
  const { totalPendingRewards, isLoading: isLoadingRewards } =
    useMultiPreviewPayout(claimableTokenIds);

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
        borderRadius: "16px",
        padding: "2rem",
        border: "3px solid #5A4530",
        background: "#4A3420",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "2rem",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Left Side - Balance and Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: "400",
            color: "#C4B5A0",
            margin: "0",
            textTransform: "none",
          }}
        >
          Your rewards balance
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
                fontSize: "3rem",
                fontWeight: "700",
                color: "#F7A129",
                margin: "0 0 0.5rem 0",
                fontFamily: "'Clash Display', sans-serif",
              }}
            >
              {formatTokenAmount(balance, decimals, 2)} {symbol || "PBTC"}
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#A08B6F",
                margin: "0 0 0.5rem 0",
              }}
            >
              {name || "Pots Buy This Coin"}
            </p>
            {isLoadingRewards ? (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "green",
                  margin: "0.5rem 0 0 0",
                }}
              >
                Calculating unclaimed rewards...
              </p>
            ) : totalPendingRewards > 0n ? (
              <p
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "green",
                  margin: "0.5rem 0 0 0",
                }}
              >
                {formatTokenAmount(totalPendingRewards, decimals, 6)} unclaimed
              </p>
            ) : null}
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
          <div style={{ display: "flex", gap: "0.75rem" }}>
          <a
            href={burnTokenUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              padding: "0.875rem 1.5rem",
              borderRadius: "12px",
              background: "#F7A129",
              border: "none",
              color: "#2D1F10",
              fontSize: "0.9rem",
              fontWeight: "700",
              textDecoration: "none",
              transition: "all 0.3s",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.background = "#FB9A1B";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = "#F7A129";
            }}
          >
            <span>Burn Tokens in AIOV</span>
            <span>→</span>
          </a>
          {rewardsAddress && (
            <a
              href={getExplorerUrl(rewardsAddress)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.875rem 1.25rem",
                borderRadius: "12px",
                background: "rgba(247, 161, 41, 0.15)",
                border: "2px solid rgba(247, 161, 41, 0.3)",
                color: "#F7A129",
                fontSize: "0.875rem",
                fontWeight: "700",
                textDecoration: "none",
                transition: "all 0.3s",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(247, 161, 41, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(247, 161, 41, 0.15)";
              }}
            >
              View Token ↗
            </a>
          )}
          </div>
        )}
      </div>

      {/* Right Side - NFT Cards */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          transform: "perspective(1000px) rotateY(-10deg)",
        }}
      >
        <div
          style={{
            width: "140px",
            height: "160px",
            borderRadius: "12px",
            border: "3px solid #F7A129",
            overflow: "hidden",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
            transform: "translateX(20px) rotate(-5deg)",
          }}
        >
          <img
            src="/nft-rolling-banner/1.avif"
            alt="NFT 1"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            width: "140px",
            height: "160px",
            borderRadius: "12px",
            border: "3px solid #F7A129",
            overflow: "hidden",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
            transform: "translateZ(20px)",
            zIndex: 2,
          }}
        >
          <img
            src="/nft-rolling-banner/2.avif"
            alt="NFT 2"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            width: "140px",
            height: "160px",
            borderRadius: "12px",
            border: "3px solid #F7A129",
            overflow: "hidden",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
            transform: "translateX(-20px) rotate(5deg)",
          }}
        >
          <img
            src="/nft-rolling-banner/3.avif"
            alt="NFT 3"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
}
