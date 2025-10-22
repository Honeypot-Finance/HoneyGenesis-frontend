import "@/css/home.css";
import MainContentWrapper from "./components/template/MainContentWrapper/MainContentWrapper";
import GeneralButton from "./components/atoms/GeneralButton/GeneralButton";

import mole from "@/assets/smoking-mole.svg";

// import { Link } from "react-router-dom";
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

  return (
    <div
      className="App"
      style={{ backgroundImage: `url(/background-pot-icon.svg)` }}
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
          <p className="desc">
            Join <span style={{ color: "#ECC94E" }}>HoneyGenesis NFT</span> for
            a thrilling battle with sweet rewards.
          </p>{" "}
          {/* <Countdown date={countDownDate} completeRenderer={completeRenderer} /> */}{" "}
          <a
            href={"https://magiceden.io/collections/berachain/honeygenesis-44"}
          >
            <GeneralButton
              style={{
                margin: "3rem",
              }}
            >
              GET NFT
            </GeneralButton>
          </a>
        </main>
      </MainContentWrapper>
    </div>
  );
}

export default App;
