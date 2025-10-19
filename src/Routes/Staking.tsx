import { useAccount } from "wagmi";
import MainContentWrapper from "@/components/template/MainContentWrapper/MainContentWrapper";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { RewardsDisplay } from "@/components/staking/RewardsDisplay";
import { StakingStats } from "@/components/staking/StakingStats";
import { StakingTabs } from "@/components/staking/StakingTabs";
import { NFTRollingBanner } from "@/components/staking/NFTRollingBanner";
import "@/css/staking.css";

function Staking() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  if (!isConnected) {
    return (
      <div className="App staking">
        <MainContentWrapper>
          <main className="main">
            <h1 className="title">NFT Staking 🍯</h1>
            <div className="staking-connect-prompt">
              <p className="desc">
                Connect your wallet to start staking your NFTs and earning
                rewards
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
                  <h3>1. Stake Your NFT</h3>
                  <p>
                    Deposit your NFT into the staking contract to start earning
                    rewards. You'll need to approve the contract first.
                  </p>
                </div>
                <div className="info-section">
                  <h3>2. Earn Rewards with Multipliers</h3>
                  <p>
                    Rewards accrue every second based on the current reward
                    rate. Your multiplier increases by 1x for every 30 days
                    staked (e.g., 2x after 30 days, 3x after 60 days).
                  </p>
                </div>
                <div className="info-section">
                  <h3>3. Claim or Unstake</h3>
                  <p>
                    Claim your rewards at any time without unstaking, or unstake
                    to get your NFT back (rewards are automatically claimed on
                    unstake).
                  </p>
                </div>
                <div className="info-section warning">
                  <h3>4. Burn for Bonus</h3>
                  <p>
                    Burn your staked NFT permanently to earn additional bonus
                    rewards. This action is irreversible!
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
