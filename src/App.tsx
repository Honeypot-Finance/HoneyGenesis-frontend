import "@/css/home.css";
import MainContentWrapper from "./components/template/MainContentWrapper/MainContentWrapper";
import GeneralButton from "./components/atoms/GeneralButton/GeneralButton";
import NFTCarousel from "./components/molecules/NFTCarousel/NFTCarousel";
import { Link } from "react-router-dom";

import mole from "@/assets/smoking-mole.svg";
import arrowUpRight from "@/assets/arrow_up_right.svg";
import arrowRight from "@/assets/arrow_right.svg";

// import Countdown from "@/components/molecules/CountDown/CountDown";

function App() {
  // const countDownDate = new Date(1711035000000); //"2024-03-21 15:30 UTC"
  // const completeRenderer = (
  //   <Link to={"./mint"}>
  //     <GeneralButton
  //       style={{
  //         margin: "3rem",
  //       }}
  //     >
  //       Mint Now
  //     </GeneralButton>
  //   </Link>
  // );

  // NFT carousel images from public folder
  const bearImages = [
    "/nft-rolling-banner/1.avif",
    "/nft-rolling-banner/2.avif",
    "/nft-rolling-banner/3.avif",
    "/nft-rolling-banner/4.avif",
    "/nft-rolling-banner/5.avif",
    "/nft-rolling-banner/6.avif",
    "/nft-rolling-banner/7.avif",
  ];

  return (
    <div
      className="App"
      style={{
        backgroundColor: "#3B2712",
        backgroundImage: `url(/background-pot-icon.svg)`,
      }}
    >
      <MainContentWrapper>
        <main className="homepage-main">
          <div className="bg-logo" />
          <img
            className="meme-img"
            src={mole}
            alt=""
          />{" "}
          <img
            className="meme-img2"
            src={mole}
            alt=""
          />
          <h1 className="main-title">HoneyGenesis NFT</h1>
          <p className="desc">
            Join HoneyGenesis NFT for a thrilling battle with sweet rewards.
          </p>{" "}
          {/* <Countdown date={countDownDate} completeRenderer={completeRenderer} /> */}{" "}
          <div className="cta-buttons">
            <a
              href={
                "https://magiceden.io/collections/berachain/honeygenesis-44"
              }
            >
              <GeneralButton
                className="get-nft-button"
                style={{
                  margin: "1rem",
                }}
              >
                Get NFT
                <img
                  src={arrowUpRight}
                  alt=""
                  className="button-arrow"
                  style={{
                    scale: "60%",
                  }}
                />
              </GeneralButton>
            </a>

            <Link to="/staking">
              <GeneralButton
                className="stake-now-button"
                style={{
                  margin: "1rem",
                }}
              >
                Stake Now
                <img
                  src={arrowRight}
                  alt=""
                  className="button-arrow"
                />
              </GeneralButton>
            </Link>
          </div>
          <NFTCarousel images={bearImages} />
        </main>
      </MainContentWrapper>
    </div>
  );
}

export default App;
