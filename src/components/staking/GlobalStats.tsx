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
    <>
      <div style={{ marginBottom: "2rem", width: "100%" }}>
        <h2
          className="stats-title"
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "#C4B5A0",
            margin: "0 0 1.5rem 0",
          }}
        >
          Global Stats
        </h2>

        {isLoading ? (
          <div>
            <p style={{ fontSize: "1rem", color: "#A08B6F", margin: 0 }}>
              Loading statistics...
            </p>
          </div>
        ) : stats ? (
          <div
            className="global-stats-grid"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "2rem",
              width: "100%",
            }}
          >
            {/* Total Rewards Claimed */}
            <div>
              <p
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "white",
                  margin: "0 0 0.5rem 0",
                  fontFamily: "'Clash Display', sans-serif",
                }}
              >
                {parseFloat(stats.totalAllRewardsClaimed).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }
                )}{" "}
                {symbol || "PBTC"}
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#C4B5A0",
                  margin: 0,
                }}
              >
                Total Rewards Claimed
              </p>
            </div>

            {/* Total NFTs Staked */}
            <div>
              <p
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "white",
                  margin: "0 0 0.5rem 0",
                  fontFamily: "'Clash Display', sans-serif",
                }}
              >
                {stats.totalStaked}
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#C4B5A0",
                  margin: 0,
                }}
              >
                Total NFTs Staked
              </p>
            </div>

            {/* Total Burned */}
            <div>
              <p
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "white",
                  margin: "0 0 0.5rem 0",
                  fontFamily: "'Clash Display', sans-serif",
                }}
              >
                {stats.totalBurned}
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#C4B5A0",
                  margin: 0,
                }}
              >
                Total Burned
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: "1rem", color: "#A08B6F", margin: 0 }}>
              No statistics available
            </p>
          </div>
        )}
      </div>
    </>
  );
}
