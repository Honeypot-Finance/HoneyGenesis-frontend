import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import MainContentWrapper from "@/components/template/MainContentWrapper/MainContentWrapper";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { StakingTabsDynamic } from "@/components/staking/StakingTabsDynamic";
import { NFTStakingABI } from "@/abi/NFTStakingABI";
import { DEFAULT_STAKING_CHAIN_ID } from "@/consts";
import "@/css/staking.css";

function StakingDynamic() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const [stakingContractAddress, setStakingContractAddress] =
    useState<string>("");
  const [isConfigured, setIsConfigured] = useState(false);

  // Fetch NFT address from staking contract
  const { data: nftContractAddress } = useReadContract({
    address:
      isConfigured && stakingContractAddress
        ? (stakingContractAddress as `0x${string}`)
        : undefined,
    abi: NFTStakingABI,
    functionName: "nft",
    chainId: DEFAULT_STAKING_CHAIN_ID,
    query: {
      enabled: isConfigured && !!stakingContractAddress,
    },
  });

  if (!isConnected) {
    return (
      <div className="App staking">
        <MainContentWrapper>
          <main className="main">
            <h1 className="title">Dynamic NFT Staking 🔧</h1>
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

  if (!isConfigured) {
    return (
      <div className="App staking">
        <MainContentWrapper>
          <main className="main">
            <h1 className="title">Dynamic NFT Staking 🔧</h1>
            <div
              className="staking-tabs-container"
              style={{ maxWidth: "600px", margin: "2rem auto" }}
            >
              <div style={{ padding: "2rem" }}>
                <div
                  className="info-box"
                  style={{
                    marginBottom: "2rem",
                    background: "rgba(255, 205, 77, 0.1)",
                    border: "2px solid #ffcd4d",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      color: "#ffcd4d",
                      margin: 0,
                    }}
                  >
                    ⚙️ Configuration Required
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#999999",
                      marginTop: "0.5rem",
                    }}
                  >
                    Enter the staking contract address. The NFT contract address
                    will be automatically fetched from the staking contract.
                  </p>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      color: "#ffcd4d",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Staking Contract Address
                  </label>
                  <input
                    type="text"
                    value={stakingContractAddress}
                    onChange={(e) => setStakingContractAddress(e.target.value)}
                    placeholder="0x..."
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      fontSize: "0.9rem",
                      backgroundColor: "#1a1a1a",
                      border: "2px solid #333",
                      borderRadius: "8px",
                      color: "#fff",
                      fontFamily: "monospace",
                    }}
                  />
                </div>

                <GeneralButton
                  onClick={() => {
                    if (stakingContractAddress) {
                      setIsConfigured(true);
                    }
                  }}
                  disabled={!stakingContractAddress}
                  style={{ width: "100%" }}
                >
                  Configure Contract
                </GeneralButton>
              </div>
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
          <h1 className="title">Dynamic NFT Staking 🔧</h1>

          <div
            className="info-box"
            style={{
              marginBottom: "2rem",
              background: "rgba(255, 205, 77, 0.1)",
              border: "2px solid #ffcd4d",
            }}
          >
            <p
              style={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "#ffcd4d",
                margin: 0,
              }}
            >
              📋 Current Configuration
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#999999",
                marginTop: "0.5rem",
                wordBreak: "break-all",
              }}
            >
              <strong>Staking Contract:</strong> {stakingContractAddress}
              <br />
              <strong>NFT Contract:</strong>{" "}
              {nftContractAddress
                ? nftContractAddress.toString()
                : "Loading..."}
            </p>
            <GeneralButton
              onClick={() => setIsConfigured(false)}
              style={{
                marginTop: "1rem",
                fontSize: "0.8rem",
                padding: "0.5rem 1rem",
              }}
            >
              Change Configuration
            </GeneralButton>
          </div>

          {/* Staking Tabs - Stake, Unstake, Claim, Burn */}
          {nftContractAddress && (
            <StakingTabsDynamic
              stakingContractAddress={stakingContractAddress as `0x${string}`}
              nftContractAddress={nftContractAddress as `0x${string}`}
            />
          )}

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
                  <h3>🔒 1. Lock Your NFT</h3>
                  <p>
                    Simply lock your NFT to start earning passive rewards immediately.
                    Your NFT stays safe and you keep full ownership!
                  </p>
                </div>
                <div className="info-section">
                  <h3>📈 2. Watch Your Rewards Grow</h3>
                  <p>
                    Earn rewards automatically every second! The longer you stay,
                    the more you earn - your rewards multiply every 30 days (2x after
                    30 days, 3x after 60 days, and so on).
                  </p>
                </div>
                <div className="info-section">
                  <h3>💰 3. Collect Anytime</h3>
                  <p>
                    Claim your earnings whenever you want while keeping your NFT
                    locked, or unlock to get everything back at once. You're always
                    in control!
                  </p>
                </div>
                <div className="info-section warning">
                  <h3>🔥 4. Supercharge with Burn Mode</h3>
                  <p>
                    Ready to go all-in? Permanently sacrifice your NFT to activate
                    mega bonus rewards! Only for the most dedicated - there's no going back.
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

export default StakingDynamic;
