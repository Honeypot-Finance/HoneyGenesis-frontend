import { useAccount } from "wagmi";
import MainContentWrapper from "@/components/template/MainContentWrapper/MainContentWrapper";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { RewardsDisplay } from "@/components/staking/RewardsDisplay";
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
          <h1 className="title">NFT Staking 🍯</h1>

          {/* Rewards Display */}
          <RewardsDisplay />

          {/* NFT Rolling Banner */}
          <NFTRollingBanner />

          {/* Staking Tabs - Stake, Unstake, Claim, Burn */}
          <StakingTabs />

          {/* Staking Stats - Collapsible */}
          <StakingStats />

          {/* How It Works Section */}
          <div
            className="staking-tabs-container"
            style={{ marginTop: "2rem" }}
          >
            <div style={{ padding: "2rem" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#ffcd4d",
                  marginBottom: "1.5rem",
                }}
              >
                How It Works
              </h2>
              <div className="how-it-works">
                <div className="info-section">
                  <h3>🔒 1. Stake Your NFT</h3>
                  <p>
                    Simply lock your NFT to start earning passive rewards
                    immediately. Your NFT stays safe and you keep full
                    ownership!
                  </p>
                </div>
                <div className="info-section">
                  <h3>📈 2. Watch Your Rewards Grow</h3>
                  <p>
                    Earn rewards automatically every second! The longer you
                    stay, the more you earn - your rewards multiply every 30
                    days (2x after 30 days, 3x after 60 days, and so on).
                  </p>
                </div>
                <div className="info-section">
                  <h3>💰 3. Collect Anytime</h3>
                  <p>
                    Claim your earnings whenever you want while keeping your NFT
                    locked, or unlock to get everything back at once. You're
                    always in control!
                  </p>
                </div>
                <div className="info-section warning">
                  <h3>🔥 4. Supercharge with Burn Mode</h3>
                  <p>
                    Ready to go all-in? Permanently sacrifice your NFT to
                    activate mega bonus rewards! Only for the most dedicated -
                    there's no going back.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </MainContentWrapper>
    </div>
  );
}

export default Staking;
