import { useCallback, useEffect, useRef, useState } from "react";
import "@/css/home.css";
import UseHoneyPot from "@/hooks/useHoneyPot";
import { weiToEther, etherToWei } from "@/lib/currencyConvert";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useWriteContract, useChainId } from "wagmi";
import {
  useAccount,
  //useBalance
} from "wagmi";
import { contracts, maxMintAmount, chainUnit, kingdomlyFee } from "@/consts";
import HoneyGenesis from "@/abi/HoneyGenesis.json";
import { animate, motion } from "framer-motion";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";
import SingleDataBox from "@/components/atoms/SingleDataBox/SingleDataBox";
import MintedDisplay from "@/components/molecules/MintedDisplay/MintedDisplay";
import QuantityInput from "@/components/molecules/QuantityInput/QuantityInput";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";
import MainContentWrapper from "@/components/template/MainContentWrapper/MainContentWrapper";

//images
import Game from "@/components/Game";
import bgImage from "@/assets/forest-bg.png";
import nftImg from "@/assets/nft-img.jpg";
import { Link } from "react-router-dom";

function Mint() {
  const isLock: boolean =
    import.meta.env.VITE_LOCK_MINT === undefined
      ? true
      : import.meta.env.VITE_LOCK_MINT?.toString() === "true"
      ? true
      : false;

  const [amount, setAmount] = useState(1);
  const { open } = useWeb3Modal();
  const {
    getCurrentPrice,
    getNextPrice,
    getMaxAmount,
    getMintedAmount,
    mintedAmount,
    nextPrice,
    maxAmount,
    totalVIPNFTCount,
  } = UseHoneyPot();

  const mintEffectRef = useRef<HTMLDivElement>(null);
  const mintGroupRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();
  // const balance = useBalance({
  //   address: address,
  // });
  const dispatch = useAppDispatch();
  const currentChainId = useChainId();

  const [previousData, setPreviousData] = useState<string>(null);
  const { writeContract, data, isPending, isError, error, isSuccess } =
    useWriteContract();

  // function addTest() {
  //   writeContract({
  //     abi: HoneyGenesis.abi,
  //     chainId: currentChainId,
  //     functionName: `addVIPMinterTestnet`,
  //     address: contracts[currentChainId],
  //     args: ["0x988D8FE9F7F53946c6f7f5204F7B71a1215685B8", 1],
  //   });
  // }

  const mintNFT = useCallback(
    (amount: number) => {
      initEffectPosition();
      const effectSize =
        window.outerWidth > window.outerHeight
          ? window.outerWidth
          : window.outerHeight;

      mintEffectRef.current.style.borderWidth = "0px";
      mintEffectRef.current.style.width = "0px";
      mintEffectRef.current.style.height = "0px";
      if (!address) {
        open();
        return;
      }

      writeContract({
        abi: HoneyGenesis.abi,
        chainId: currentChainId,
        functionName: `mint`,
        address: contracts[currentChainId],
        args: [amount],
        value: BigInt(
          (parseInt(getCurrentPrice()) + etherToWei(kingdomlyFee)) * amount
        ),
      });

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
    },
    [address, currentChainId, getCurrentPrice, open, writeContract]
  );

  const refetchData = useCallback(() => {
    mintedAmount.refetch();
    nextPrice.refetch();
    maxAmount.refetch();
    totalVIPNFTCount.refetch();
  }, [maxAmount, mintedAmount, nextPrice, totalVIPNFTCount]);

  //init
  useEffect(() => {
    if (mintEffectRef.current === null || mintGroupRef.current === null) return;

    initEffectPosition();
    mintEffectRef.current.style.borderWidth = "0px";

    //resize
    window.addEventListener("resize", () => {
      initEffectPosition();
    });
  }, []);

  function popError() {
    if (isError && error) {
      if (error.message.includes("User denied transaction signature")) {
        dispatch(
          openPopUp({
            title: "Transaction Rejected",
            message: "You have rejected the transaction",
            info: "error",
          })
        );
      } else if (error.message.includes("Insufficient funds")) {
        refetchData();
        setTimeout(() => {
          mintNFT(amount);
        }, 1000);
      } else if (error.message.includes("Exceeds total VIP supply cap")) {
        dispatch(
          openPopUp({
            title: "Exceeds total VIP supply cap",
            message: "Contact our support team for more information.",
            info: "error",
          })
        );
      } else {
        dispatch(
          openPopUp({
            title: "Something went wrong",
            message: "Please try again later",
            info: "error",
          })
        );
      }
      console.warn(error.message);
    }
  }

  //mint error handling
  useEffect(() => {
    popError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  //mint success handling
  useEffect(() => {
    if (data !== previousData && isSuccess) {
      dispatch(
        openPopUp({
          title: "Mint Success",
          message: `You have successfully minted ${amount} NFTs\ntransaction hash: ${data}`,
          info: "success",
        })
      );

      //refetch
      setTimeout(() => {
        refetchData();
      }, 1000);

      setPreviousData(data);
    }
  }, [data, amount, dispatch, refetchData, previousData, isSuccess]);

  function initEffectPosition() {
    if (mintEffectRef.current === null || mintGroupRef.current === null) return;
    mintEffectRef.current.style.transform = "translate(-50%, -50%)";

    mintEffectRef.current.style.top =
      mintGroupRef.current.offsetTop +
      mintGroupRef.current.offsetHeight / 2 +
      "px";
    mintEffectRef.current.style.left =
      mintGroupRef.current.offsetLeft +
      mintGroupRef.current.offsetWidth / 2 +
      "px";
  }
  return (
    <div className="App">
      <MainContentWrapper lock={isLock}>
        <div className="right-section">
          <div className="nft-img-container">
            <img className="nft-img" src={nftImg} alt="Nft Image" />
          </div>
          <MintedDisplay />
        </div>
        <main className="main">
          <img src={bgImage} alt="" className="bg-img" />
          <h1 className="title">Honey Genesis 🍯</h1>

          <div className="mint-form">
            <SingleDataBox
              dataName="Current Price"
              dataValue={
                parseFloat(getMintedAmount()) >= parseFloat(getMaxAmount())
                  ? "Sold Out"
                  : Number(getCurrentPrice())
                  ? weiToEther(parseInt(getCurrentPrice())).toPrecision(2) +
                    " " +
                    chainUnit[currentChainId]
                  : "loading..."
              }
            />
            <SingleDataBox
              dataName="Next Price"
              dataValue={
                parseFloat(getMintedAmount()) >= parseFloat(getMaxAmount()) - 1
                  ? "Sold Out"
                  : Number(getNextPrice())
                  ? weiToEther(parseInt(getNextPrice())).toPrecision(2) +
                    " " +
                    chainUnit[currentChainId]
                  : "loading..."
              }
            />
            <SingleDataBox dataName="Max Available" dataValue={maxMintAmount} />
            <QuantityInput
              inputName="Quantity"
              value={amount}
              setValue={setAmount}
            />
            <p className="terms" style={{ gridColumn: "span 3" }}>
              <a
                href={`https://arbiscan.io/address/${contracts[currentChainId]}`}
                target="_blank"
              >
                Click here
              </a>{" "}
              to view the contract on Etherscan. By placing a bid you confirm
              that you have read and agree to the{" "}
              <Link to="/terms">terms of sale</Link> for this drop. Your bid
              will be refunded if you lose the auction.
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
            {/* <GeneralButton onClick={addTest}>Add Test</GeneralButton> */}
          </div>
        </main>
        <Game className="mini-game" />
      </MainContentWrapper>
    </div>
  );
}

export default Mint;
