import React from "react";
import "@/css/home.css";
import Header from "@/components/Header";

//images
import smokingMole from "@/assets/smoking-mole.png";
import imagePlaceholder from "@/assets/image-placeholder.png";
import plus from "@/assets/plus.png";
import minus from "@/assets/minus.png";
function App() {
  return (
    <div className="App">
      <Header />
      <main className="main">
        <div className="minted-display">
          <h2 className="minted__title">Minted</h2>
          <p className="minted__amount">1000/5000</p>
          <p className="minted__next-price">
            next price: <span>230</span> USDC
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
            <span className="price-input-deco"></span>200 USDC
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
              placeholder="0.00"
            />
            <img className="plus" src={plus} alt="plus" />
            <img className="minus" src={minus} alt="minus" />
          </div>
          <p className="max-available">
            MaxAvailable:<span>1.234 ETH</span>
          </p>
          <p className="terms">
            <a href="">Click here</a> to view the contract on Etherscan. By
            placing a bid you confirm that you have read and agree to the 
            <a href="">terms of sale</a> for this drop. Your bid will be
            refunded if you lose the auction.
          </p>
          <button className="mint-button" type="submit">
            Mint
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
