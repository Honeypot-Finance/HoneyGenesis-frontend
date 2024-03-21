import { useEffect, useState, useRef, useCallback } from "react";
import "@/css/home.css";
import Header from "@/components/Header";
import UseHoneyPot from "@/hooks/useHoneyPot";
import { etherToWei, weiToEther } from "@/lib/currencyConvert";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useWriteContract, useChainId } from "wagmi";
import { useAccount, useBalance } from "wagmi";
import {
  contracts,
  maxMintAmount,
  chainUnit,
  //countDownDate,
  acceptChainId,
} from "@/consts";
import HoneyGenesis from "@/abi/HoneyGenesis.json";
import { animate, motion } from "framer-motion";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";
import SingleDataBox from "@/components/atoms/SingleDataBox/SingleDataBox";
import QuantityInput from "@/components/molecules/QuantityInput/QuantityInput";

import MintedDisplay from "@/components/molecules/MintedDisplay/MintedDisplay";
import MainContentWrapper from "@/components/template/MainContentWrapper/MainContentWrapper";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";

//images
import Game from "@/components/Game";
import bgImage from "@/assets/forest-bg.png";
//import nftImg from "@/assets/nft-img.jpg";
import { Link } from "react-router-dom";

function VipMint() {
  //const isLock: boolean = Date.now() < countDownDate.getTime();
  const isLock: boolean = false;

  const mintEffectRef = useRef<HTMLDivElement>(null);
  const mintGroupRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState(1);
  const { address, chainId } = useAccount();
  const balance = useBalance({
    address: address,
  });
  const dispatch = useAppDispatch();
  const currentChainId = useChainId();
  const [previousData, setPreviousData] = useState<string>(null);
  const { writeContract, data, isPending, isError, error, isSuccess } =
    useWriteContract();

  const { open } = useWeb3Modal();
  const {
    getVIPNFTPrice,
    getTotalVIPNFTCount,
    getMaxAmount,
    getMintedVIPNFTsCount,
    totalVIPNFTCount,
    maxAmount,
    mintedVIPNFTsCount,
    VIPPrice,
    useVIPMintQuota,
    getTotalPriceWithFee,
  } = UseHoneyPot();
  const mintQuota = useVIPMintQuota(address);

  const mintNFT = useCallback(
    (amount: number) => {
      if (!address) {
        open();
        return;
      }

      initEffectPosition();

      writeContract({
        abi: HoneyGenesis.abi,
        chainId: currentChainId ? currentChainId : acceptChainId[0],
        functionName: `mintVIP`,
        address: contracts[currentChainId ? currentChainId : acceptChainId[0]],
        args: [amount],
        value: BigInt(etherToWei(getTotalPriceWithFee(true, amount))),
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
    },
    [address, currentChainId, getTotalPriceWithFee, open, writeContract]
  );

  const refetchData = useCallback(() => {
    mintedVIPNFTsCount.refetch();
    maxAmount.refetch();
    totalVIPNFTCount.refetch();
    VIPPrice.refetch();
    mintQuota.refetch();
  }, [VIPPrice, maxAmount, mintQuota, mintedVIPNFTsCount, totalVIPNFTCount]);

  //init
  useEffect(() => {
    if (!mintGroupRef.current) return;

    initEffectPosition();
    mintEffectRef.current.style.borderWidth = "0px";

    //resize
    window.addEventListener("resize", () => {
      initEffectPosition();
    });
  }, []);

  function initEffectPosition() {
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

  //mint error handling

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

  useEffect(() => {
    popError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  //if user have no vip mint quota, redirect to normal mint page
  useEffect(() => {
    if (mintQuota.data === undefined) return;
    console.log(parseInt(mintQuota.data as string));
    if (parseInt(mintQuota.data as string) === 0) {
      window.location.href = "/mint";
    }
  }, [mintQuota]);

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

  //amount handling
  useEffect(() => {
    if (amount < 0) {
      setAmount(0);
    }

    if (amount > maxMintAmount) {
      setAmount(maxMintAmount);
    }

    if (!balance.data || !balance.data.value || !balance.data.decimals) return;

    const singlePrice = weiToEther(parseInt(getVIPNFTPrice()));
    const balanceInFloat = parseFloat(
      (
        parseInt(balance.data.value.toString()) /
        Math.pow(10, balance.data.decimals)
      ).toPrecision(5)
    );

    if (singlePrice * amount > balanceInFloat) {
      setAmount(Math.floor(balanceInFloat / singlePrice));
    }
  }, [amount, balance.data, getVIPNFTPrice]);

  return (
    <div className="App">
      <Header />
      <MainContentWrapper lock={isLock}>
        <div className="right-section">
          <div className="nft-img-container">
            <img
              className="nft-img"
              src={
                "https://bafybeianvftytynjzo3twbmv36xrolkwmwfai5xcrxo6u5q3s5zsg5hwb4.ipfs.nftstorage.link"
              }
              alt="Nft Image"
            />
          </div>
          <MintedDisplay isVIPMint />
        </div>
        <main className="main">
          <img src={bgImage} alt="" className="bg-img" />
          <h1 className="title">VIP MINT 🍯</h1>

          <div className="mint-form">
            <SingleDataBox
              dataName="Current Price"
              dataValue={
                parseFloat(getMintedVIPNFTsCount()) >=
                parseFloat(getMaxAmount())
                  ? "Sold Out"
                  : Number(getVIPNFTPrice())
                  ? weiToEther(parseInt(getVIPNFTPrice())).toPrecision(2) +
                    " " +
                    chainUnit[chainId]
                  : "loading..."
              }
            />
            <SingleDataBox
              dataName="Next Price"
              dataValue={
                parseFloat(getMintedVIPNFTsCount()) >=
                parseFloat(getTotalVIPNFTCount()) - 1
                  ? "Sold Out"
                  : Number(getVIPNFTPrice())
                  ? weiToEther(parseInt(getVIPNFTPrice())).toPrecision(2) +
                    " " +
                    chainUnit[chainId]
                  : "loading..."
              }
            />
            <SingleDataBox
              dataName="Max Available"
              dataValue={
                getMintedVIPNFTsCount() == getTotalVIPNFTCount()
                  ? "Sold Out"
                  : parseInt(mintQuota.data as string)
              }
            />{" "}
            <p className="terms" style={{ gridColumn: "span 3" }}>
              <a
                href={`https://arbiscan.io/address/${
                  contracts[currentChainId ? currentChainId : acceptChainId[0]]
                }`}
                target="_blank"
              >
                Click here
              </a>{" "}
              to view the contract on Etherscan. By placing a bid you confirm
              that you have read and agree to the{" "}
              <Link to="/terms">terms of sale</Link> for this drop. Your bid
              will be refunded if you lose the auction.
            </p>
            <QuantityInput
              inputName="Quantity"
              value={amount}
              setValue={setAmount}
              vip
            />
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

export default VipMint;
