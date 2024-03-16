import "@/css/home.css";
import MainContentWrapper from "./components/template/MainContentWrapper/MainContentWrapper";
import GeneralButton from "./components/atoms/GeneralButton/GeneralButton";
import { Link } from "react-router-dom";
import Container from "./components/atoms/Container/Container";

import honeyGenesisLogo from "@/assets/honey-genesis-icon.png";
import mole from "@/assets/smoking-mole.png";
import bgPot from "@/assets/background-pot-icon.svg";

import Countdown from "@/components/molecules/CountDown/CountDown";

function App() {
  const countDownDate = new Date("2024-03-22");
  const completeRenderer = (
    <Link to={"./mint"}>
      <GeneralButton
        style={{
          margin: "3rem",
        }}
      >
        Mint Now
      </GeneralButton>
    </Link>
  );

  return (
    <div className="App" style={{ backgroundImage: `url(${bgPot})` }}>
      <MainContentWrapper>
        <main className="homepage-main">
          <div className="bg-logo" />
          <img className="meme-img" src={mole} alt="" />{" "}
          <img className="meme-img2" src={mole} alt="" />
          <div className="logo-group">
            <img className="logo" src={honeyGenesisLogo} alt="" />
            <h1 className="title">Honey Genesis</h1>
          </div>
          <p className="desc">
            Join HoneyGenesis NFT for a thrilling battle over sweet rewards.
            Defend your honeypot, earn $HPOT tokens, and mutate into Gen-1 NFTs
            on Berachain's mainnet. Dive into the adventure today!
          </p>{" "}
          <Container>Mint Live:</Container>
          <Countdown date={countDownDate} completeRenderer={completeRenderer} />
        </main>
      </MainContentWrapper>
    </div>
  );
}

export default App;
