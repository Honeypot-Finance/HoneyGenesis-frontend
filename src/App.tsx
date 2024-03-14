import "@/css/home.css";
import MainContentWrapper from "./components/template/MainContentWrapper/MainContentWrapper";
import GeneralButton from "./components/atoms/GeneralButton/GeneralButton";
import { Link } from "react-router-dom";

import honeyGenesisLogo from "@/assets/honey-genesis-icon.png";

function App() {
  return (
    <div className="App">
      <MainContentWrapper>
        <main className="homepage-main">
          <div className="bg-logo" />
          <div className="logo-group">
            <img className="logo" src={honeyGenesisLogo} alt="" />
            <h1 className="title">Honey Genesis</h1>
          </div>
          <p className="desc">
            Join HoneyGenesis NFT for a thrilling battle over sweet rewards.
            Defend your honeypot, earn $HPOT tokens, and mutate into Gen-1 NFTs
            on Berachain's mainnet. Dive into the adventure today!
          </p>
          <Link to={"./mint"}>
            <GeneralButton>Mint Now</GeneralButton>
          </Link>
        </main>
      </MainContentWrapper>
    </div>
  );
}

export default App;
