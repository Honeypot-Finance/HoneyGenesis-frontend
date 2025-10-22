import { useGlobalStats } from "@/hooks/useGlobalStats";
import { useRewardsTokenInfo } from "@/hooks/useRewardsToken";
import { formatTokenAmount } from "@/lib/stakingUtils";

export function GlobalStats() {
  const { stats, isLoading, error } = useGlobalStats();
  const { symbol, decimals } = useRewardsTokenInfo();

  if (error) {
    return null; // Don't show anything if there's an error
  }

  return (
    <div
      style={{
        borderRadius: "var(--border-radius)",
        padding: "2rem",
        border: "var(--border-size) solid #ffcd4d",
        background: "linear-gradient(135deg, #1a1410 0%, #31220c 100%)",
        boxShadow: "0 4px 24px rgba(255, 205, 77, 0.15)",
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
        Global Statistics
      </h2>

      {isLoading ? (
        <div>
          <p style={{ fontSize: "1rem", color: "#999999", margin: 0 }}>
            Loading statistics...
          </p>
        </div>
      ) : stats ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {/* Total Staked */}
          <div>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#999999",
                margin: "0 0 0.5rem 0",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Total Staked
            </p>
            <p
              style={{
                fontSize: "1.75rem",
                fontWeight: "bold",
                color: "#10B981",
                margin: 0,
              }}
            >
              {stats.totalStaked}
            </p>
          </div>

          {/* Total Burned */}
          <div>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#999999",
                margin: "0 0 0.5rem 0",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Total Burned
            </p>
            <p
              style={{
                fontSize: "1.75rem",
                fontWeight: "bold",
                color: "#FF6B6B",
                margin: 0,
              }}
            >
              {stats.totalBurned}
            </p>
          </div>

          {/* Total Rewards Claimed */}
          <div>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#999999",
                margin: "0 0 0.5rem 0",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Total Rewards Claimed
            </p>
            <p
              style={{
                fontSize: "1.75rem",
                fontWeight: "bold",
                color: "#ffcd4d",
                margin: 0,
              }}
            >
              {parseFloat(stats.totalAllRewardsClaimed).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}{" "}
              {symbol || "REWARD"}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: "1rem", color: "#999999", margin: 0 }}>
            No statistics available
          </p>
        </div>
      )}
    </div>
  );
}
