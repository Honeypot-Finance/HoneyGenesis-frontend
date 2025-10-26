import { useAccount } from "wagmi";
import MainContentWrapper from "@/components/template/MainContentWrapper/MainContentWrapper";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { RewardsDisplay } from "@/components/staking/RewardsDisplay";
import { GlobalStats } from "@/components/staking/GlobalStats";
import { StakingStats } from "@/components/staking/StakingStats";
import { StakingTabs } from "@/components/staking/StakingTabs";
import { NFTRollingBanner } from "@/components/staking/NFTRollingBanner";
import { TestToolkit } from "@/components/staking/TestToolkit";
import "@/css/staking.css";

function Staking() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const isDev = import.meta.env.VITE_DEV === "true";

  if (!isConnected) {
    return (
      <div className="App staking">
        {isDev && <TestToolkit />}
        <MainContentWrapper>
          <main className="main">
            <h1 className="title">NFT Staking 🍯</h1>
            <div className="staking-connect-prompt">
              <p className="desc">
                Connect your wallet to unlock passive rewards! Start earning
                immediately by locking your NFTs.
              </p>
              <GeneralButton
                onClick={() => open()}
                style={{ margin: "2rem auto" }}
              >
                Connect Wallet
              </GeneralButton>
            </div>
          </main>
        </MainContentWrapper>
      </div>
    );
  }

  return (
    <div className="App staking">
      {isDev && <TestToolkit />}
      <MainContentWrapper>
        <main className="main">
          <h1 className="staking-title">NFT Staking</h1>
          <p className="staking-subtitle">
            Unlock exclusive rewards and revenue streams by holding HoneyGenesis NFTs
          </p>

          {/* Rewards Display with NFT Cards */}
          <RewardsDisplay />

          {/* Global Stats - Below Rewards */}
          <GlobalStats />

          {/* Staking Tabs - Stake, Unstake, Claim, Burn */}
          <StakingTabs />

          {/* Staking Stats - Collapsible */}
          <StakingStats />

          {/* How It Works Section */}
          <div style={{ marginTop: "2rem", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#C4B5A0",
                margin: "0 0 1.5rem 0",
              }}
            >
              How It Works
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  background: "#4A3420",
                  borderRadius: "16px",
                  border: "3px solid #5A4530",
                  padding: "2rem",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(247, 161, 41, 0.15)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>🔒</span>
                </div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    color: "white",
                    margin: "0 0 0.75rem 0",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  1. Stake your NFT
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "400",
                    color: "#C4B5A0",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  Simply lock your NFT to start earning passive rewards
                  immediately. Your NFT stays safe and you keep full ownership!
                </p>
              </div>

              <div
                style={{
                  background: "#4A3420",
                  borderRadius: "16px",
                  border: "3px solid #5A4530",
                  padding: "2rem",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(247, 161, 41, 0.15)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>📈</span>
                </div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    color: "white",
                    margin: "0 0 0.75rem 0",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  2. Watch Your Rewards Grow
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "400",
                    color: "#C4B5A0",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  Earn rewards automatically every second! The longer you stay,
                  the more you earn - your rewards multiply every 30 days (2x
                  after 30 days, 3x after 60 days, and so on).
                </p>
              </div>

              <div
                style={{
                  background: "#4A3420",
                  borderRadius: "16px",
                  border: "3px solid #5A4530",
                  padding: "2rem",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(247, 161, 41, 0.15)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>💰</span>
                </div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    color: "white",
                    margin: "0 0 0.75rem 0",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  3. Collect Anytime
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "400",
                    color: "#C4B5A0",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  Claim your earnings whenever you want while keeping your NFT
                  locked, or unlock to get everything back at once. You're always
                  in control!
                </p>
              </div>

              <div
                style={{
                  background: "#4A3420",
                  borderRadius: "16px",
                  border: "3px solid #5A4530",
                  padding: "2rem",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(247, 161, 41, 0.15)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>🔥</span>
                </div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    color: "white",
                    margin: "0 0 0.75rem 0",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  4. Supercharge with Burn Mode
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "400",
                    color: "#C4B5A0",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  Ready to go all-in? Permanently sacrifice your NFT to activate
                  mega bonus rewards! Only for the most dedicated - there's no
                  going back.
                </p>
              </div>
            </div>
          </div>
        </main>
      </MainContentWrapper>
    </div>
  );
}

export default Staking;
