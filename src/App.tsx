import "@/css/home.css";
import MainContentWrapper from "./components/template/MainContentWrapper/MainContentWrapper";
import GeneralButton from "./components/atoms/GeneralButton/GeneralButton";
import { Link } from "react-router-dom";
import useHoneyPot from "./hooks/useHoneyPot";
import { weiToEther } from "./lib/currencyConvert";

import honeyGenesisLogo from "@/assets/honey-genesis-icon.png";
import SingleDataBox from "./components/atoms/SingleDataBox/SingleDataBox";

function App() {
  const { getCurrentPrice, getNextPrice, getMaxAmount } = useHoneyPot();
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
          </p>{" "}
          <div className="critical-data-group">
            <SingleDataBox
              dataName="Current Price"
              dataValue={
                Number(getCurrentPrice())
                  ? weiToEther(parseInt(getCurrentPrice())).toPrecision(2) +
                    " ETH"
                  : "loading..."
              }
              bgType="solid"
            />
            <SingleDataBox
              dataName="Next Price"
              dataValue={
                Number(getNextPrice())
                  ? weiToEther(parseInt(getNextPrice())).toPrecision(2) + " ETH"
                  : "loading..."
              }
              bgType="solid"
            />
            <SingleDataBox
              dataName="Max Available"
              dataValue={Number(getMaxAmount()) ? getMaxAmount() : "loading..."}
              bgType="solid"
            />
          </div>
          <Link to={"./mint"}>
            <GeneralButton>Mint Now</GeneralButton>
          </Link>
        </main>
      </MainContentWrapper>
    </div>
  );
}

export default App;
