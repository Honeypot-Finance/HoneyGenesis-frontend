import { useEffect, useState, useRef } from "react";
import "@/css/home.css";
import Header from "@/components/Header";
import UseHoneyPot from "@/hooks/useHoneyPot";
import { weiToEther } from "@/lib/currencyConvert";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useWriteContract } from "wagmi";
import { useAccount, useBalance } from "wagmi";
import { chainId, contractAddress, maxMintAcmount } from "@/consts";
import HoneyGenesis from "@/abi/HoneyGenesis.json";
import { animate, motion } from "framer-motion";

//images
import smokingMole from "@/assets/smoking-mole.png";
import imagePlaceholder from "@/assets/image-placeholder.png";
import plus from "@/assets/plus.png";
import minus from "@/assets/minus.png";
import honeyPot from "@/assets/honey-pot.svg";
import Game from "@/components/Game";

function VipMint() {
  const { open } = useWeb3Modal();
  const { getVIPNFTPrice, getMintedVIPNFTsCount, getTotalVIPNFTCount } =
    UseHoneyPot();
  const mintEffectRef = useRef<HTMLDivElement>(null);
  const mintGroupRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState(1);
  const { address } = useAccount();
  const balance = useBalance({
    address: address,
  });

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
      functionName: `mintVIP`,
      address: contractAddress,
      args: [amount],
      value: BigInt(parseInt(getVIPNFTPrice()) * amount),
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
    if (!mintGroupRef.current) return;

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

  //amount handling
  useEffect(() => {
    if (amount < 0) {
      setAmount(0);
    }

    if (amount > maxMintAcmount) {
      setAmount(maxMintAcmount);
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

  function increaseAmount() {
    setAmount(amount + 1);
  }

  function decreaseAmount() {
    if (amount > 0) {
      setAmount(amount - 1);
    }
  }

  return (
    <div className="App">
      <Header />
      <main className="main">
        <div className="minted-display">
          <h2 className="minted__title">Minted</h2>
          <p className="minted__amount">
            {getMintedVIPNFTsCount()}/{getTotalVIPNFTCount()}
          </p>
          <img src={smokingMole} alt="smoking-mole" className="smoking-mole" />
        </div>
        <h1 className="title">🍯VIP MINT🍯</h1>
        <img
          src={imagePlaceholder}
          alt="Some place holder"
          className="image-placeholder"
        />
        <form className="mint-form" action="">
          <label className="price-label" htmlFor="price">
            Price
          </label>
          <div className="price-input" id="price">
            <span className="price-input-deco"></span>
            <span>
              {Number(getVIPNFTPrice())
                ? (weiToEther(parseInt(getVIPNFTPrice())) * amount).toPrecision(
                    2
                  )
                : getVIPNFTPrice()}{" "}
              ETH
            </span>
          </div>
          <label className="amount-label" htmlFor="amount">
            Amount
          </label>
          <div className="amount-input-container">
            <input
              className="amount-input"
              type="number"
              id="amount"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
            <img
              className="plus"
              src={plus}
              alt="plus"
              onClick={increaseAmount}
            />
            <img
              className="minus"
              src={minus}
              alt="minus"
              onClick={decreaseAmount}
            />
          </div>
          <p className="max-available">
            Max Mint per transaction: {maxMintAcmount}
          </p>
          <p className="max-available">
            Wallet:{" "}
            <span>
              {balance.data &&
                balance.data.value &&
                (
                  parseInt(balance.data.value.toString()) /
                  Math.pow(10, balance.data.decimals)
                ).toPrecision(5)}
            </span>{" "}
            ETH
          </p>
          <p className="terms">
            <a href="">Click here</a> to view the contract on Etherscan. By
            placing a bid you confirm that you have read and agree to the{" "}
            <a href="">terms of sale</a> for this drop. Your bid will be
            refunded if you lose the auction.
          </p>
          {(isPending && (
            <div className="mint-group">
              <img
                src={honeyPot}
                alt="Some place holder"
                className="mint-img"
                onClick={() => mintNFT(amount)}
              />
              <div className="mint-text">...</div>
            </div>
          )) || (
            <motion.div
              ref={mintGroupRef}
              className="mint-group"
              whileHover={{
                scale: [1, 1.1, 1.1, 1.1, 1.1],
                x: [0, 50, 0, -50, 0],
                rotate: [0, 10, 0, -10, 0],
              }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={honeyPot}
                alt="Some place holder"
                className="mint-img"
                onClick={() => mintNFT(amount)}
              />
              <div className="mint-text">Mint</div>
            </motion.div>
          )}{" "}
          <motion.div
            layout
            className="mint-effect"
            ref={mintEffectRef}
            transition={{ duration: 1 }}
          ></motion.div>
        </form>
      </main>

      <Game className="mini-game" />
    </div>
  );
}

export default VipMint;
