import { useEffect, useState } from "react";
import "@/css/home.css";
import Header from "@/components/Header";
import UseHoneyPot from "@/hooks/useHoneyPot";
import { weiToEther } from "./lib/currencyConvert";
import { useWriteContract } from "wagmi";
import { useAccount, useBalance } from "wagmi";
import { chainId, contractAddress } from "@/consts";
import HoneyGenesis from "@/abi/HoneyGenesis.json";

//images
import smokingMole from "@/assets/smoking-mole.png";
import imagePlaceholder from "@/assets/image-placeholder.png";
import plus from "@/assets/plus.png";
import minus from "@/assets/minus.png";

function App() {
  const { getCurrentPrice, getNextPrice, getMintedAmount, getMaxAmount } =
    UseHoneyPot();
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
    writeContract({
      abi: HoneyGenesis.abi,
      chainId: chainId,
      functionName: `mint`,
      address: contractAddress,
      args: [parseInt(getMintedAmount()) + 1, amount],
      value: BigInt(parseInt(getCurrentPrice()) * amount),
    });
  }

  //mint error handling
  useEffect(() => {
    if (isError) {
      console.warn(error);
      alert(error);
    }
  }, [isError, error]);

  //amount handling
  useEffect(() => {
    if (amount < 0) {
      setAmount(0);
    }

    if (!balance.data || !balance.data.value || !balance.data.decimals) return;

    const singlePrice = weiToEther(parseInt(getCurrentPrice()));
    const balanceInFloat = parseFloat(
      (
        parseInt(balance.data.value.toString()) /
        Math.pow(10, balance.data.decimals)
      ).toPrecision(5)
    );

    if (singlePrice * amount > balanceInFloat) {
      setAmount(Math.floor(balanceInFloat / singlePrice));
    }
  }, [amount]);

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
            {getMintedAmount()}/{getMaxAmount()}
          </p>
          <p className="minted__next-price">
            next price:{" "}
            <span>
              {Number(getNextPrice())
                ? weiToEther(parseInt(getNextPrice()))
                : getNextPrice()}
            </span>{" "}
            ETH
          </p>
          <img src={smokingMole} alt="smoking-mole" className="smoking-mole" />
        </div>
        <h1 className="title">Honey Genesis 🍯</h1>
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
              {Number(getCurrentPrice())
                ? weiToEther(parseInt(getCurrentPrice()))
                : getNextPrice()}{" "}
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
            MaxAvailable:{" "}
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
            placing a bid you confirm that you have read and agree to the
            <a href="">terms of sale </a>for this drop. Your bid will be
            refunded if you lose the auction.
          </p>
          {(isPending && (
            <div
              className="mint-button disabled"
              onClick={() => mintNFT(amount)}
            >
              Mint
            </div>
          )) || (
            <div className="mint-button" onClick={() => mintNFT(amount)}>
              Mint
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

export default App;
