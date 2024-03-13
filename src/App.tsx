import { useEffect, useRef, useState } from "react";
import "@/css/home.css";
import UseHoneyPot from "@/hooks/useHoneyPot";
import { weiToEther } from "./lib/currencyConvert";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useWriteContract } from "wagmi";
import {
  useAccount,
  //useBalance
} from "wagmi";
import { chainId, contractAddress } from "@/consts";
import HoneyGenesis from "@/abi/HoneyGenesis.json";
import { animate, motion } from "framer-motion";
import GeneralButton from "./components/atoms/GeneralButton/GeneralButton";
import SingleDataBox from "./components/atoms/SingleDataBox/SingleDataBox";
import MintedDisplay from "./components/molecules/MintedDisplay/MintedDisplay";
import QuantityInput from "./components/molecules/QuantityInput/QuantityInput";

import MainContentWrapper from "./components/template/MainContentWrapper/MainContentWrapper";

//images
import Game from "@/components/Game";
import bgImage from "@/assets/forest-bg.png";
import nftImg from "@/assets/nft-img.jpg";

function App() {
  const isLock: boolean =
    import.meta.env.VITE_LOCK_MINT === undefined
      ? true
      : import.meta.env.VITE_LOCK_MINT?.toString() === "true"
      ? true
      : false;

  const [amount, setAmount] = useState(1);
  const { open } = useWeb3Modal();
  const { getCurrentPrice, getNextPrice, getMaxAmount } = UseHoneyPot();
  const mintEffectRef = useRef<HTMLDivElement>(null);
  const mintGroupRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();
  // const balance = useBalance({
  //   address: address,
  // });

  const {
    writeContract,
    //data,
    isPending,
    isError,
    error,
  } = useWriteContract();

  function mintNFT(amount: number) {
    if (!address) {
      open();
      return;
    }

    writeContract({
      abi: HoneyGenesis.abi,
      chainId: chainId,
      functionName: `mint`,
      address: contractAddress,
      args: [amount],
      value: BigInt(parseInt(getCurrentPrice()) * amount),
    });

    const effectSize =
      window.outerWidth > window.outerHeight
        ? window.outerWidth
        : window.outerHeight;

    mintEffectRef.current.style.borderWidth = "0px";
    mintEffectRef.current.style.width = "0px";
    mintEffectRef.current.style.height = "0px";

    animate(
      mintEffectRef.current,
      {
        borderWidth: ["0px", `${effectSize * 2}px`],
      },
      { duration: 1 }
    ).then(() => {
      animate(
        mintEffectRef.current,
        {
          width: ["0px", `${effectSize * 2}px`],
        },
        { duration: 1 }
      );
      animate(
        mintEffectRef.current,
        {
          height: ["0px", `${effectSize * 2}px`],
        },
        { duration: 1 }
      ).then(() => {
        animate(
          mintEffectRef.current,
          {
            borderWidth: ["0px"],
          },
          { duration: 0 }
        );

        animate(
          mintEffectRef.current,
          {
            width: ["0px"],
          },
          { duration: 0 }
        );

        animate(
          mintEffectRef.current,
          {
            height: ["0px"],
          },
          { duration: 0 }
        );
      });
    });
  }

  //init
  useEffect(() => {
    if (mintEffectRef.current === null || mintGroupRef.current === null) return;

    initEffectPosition();
    mintEffectRef.current.style.borderWidth = "0px";

    //resize
    window.addEventListener("resize", () => {
      initEffectPosition();
    });

    function initEffectPosition() {
      mintEffectRef.current.style.top =
        mintGroupRef.current.offsetTop +
        mintGroupRef.current.offsetHeight / 2 +
        "px";
      mintEffectRef.current.style.left =
        mintGroupRef.current.offsetLeft +
        mintGroupRef.current.offsetWidth / 2 +
        "px";
    }
  }, []);

  //mint error handling
  useEffect(() => {
    if (isError) {
      console.warn(error);
    }
  }, [isError, error]);

  return (
    <div className="App">
      <MainContentWrapper lock={isLock}>
        <div className="nft-img-container">
          <img className="nft-img" src={nftImg} alt="Nft Image" />
        </div>
        <main className="main">
          <img src={bgImage} alt="" className="bg-img" />
          <MintedDisplay />
          <h1 className="title">Honey Genesis 🍯</h1>

          <div className="mint-form">
            <SingleDataBox
              dataName="Current Price"
              dataValue={
                Number(getCurrentPrice())
                  ? weiToEther(parseInt(getCurrentPrice())).toPrecision(2) +
                    " ETH"
                  : "loading..."
              }
            />
            <SingleDataBox
              dataName="Next Price"
              dataValue={
                Number(getNextPrice())
                  ? weiToEther(parseInt(getNextPrice())).toPrecision(2) + " ETH"
                  : "loading..."
              }
            />
            <SingleDataBox
              dataName="Max Available"
              dataValue={Number(getMaxAmount()) ? getMaxAmount() : "loading..."}
            />
            <QuantityInput
              inputName="Quantity"
              value={amount}
              setValue={setAmount}
            />
            <p className="terms" style={{ gridColumn: "span 3" }}>
              <a href="">Click here</a> to view the contract on Etherscan. By
              placing a bid you confirm that you have read and agree to the{" "}
              <a href="">terms of sale</a> for this drop. Your bid will be
              refunded if you lose the auction.
            </p>
            {(isPending && (
              <div
                className="mint-group"
                ref={mintGroupRef}
                style={{ gridColumn: "span 3" }}
              >
                <GeneralButton disabled={true}>Minting...</GeneralButton>
              </div>
            )) || (
              <div
                className="mint-group"
                ref={mintGroupRef}
                style={{ gridColumn: "span 3" }}
              >
                <GeneralButton onClick={() => mintNFT(amount)}>
                  Mint
                </GeneralButton>
              </div>
            )}{" "}
            <motion.div
              layout
              className="mint-effect"
              ref={mintEffectRef}
              transition={{ duration: 1 }}
            ></motion.div>
          </div>
        </main>
        <Game className="mini-game" />
      </MainContentWrapper>
    </div>
  );
}

export default App;
