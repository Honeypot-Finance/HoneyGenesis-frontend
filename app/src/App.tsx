import React from "react";
import "@/css/home.css";
import Header from "@/components/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <div className="minted-display">
          <h2>minted</h2>
          <p>1000/5000</p>
          <p>
            next price: <span>230</span> USDC
          </p>
          <img src="" alt="smoking-mole" />
        </div>
        <h1>Honey Genesis</h1>
        <img src="#" alt="Some place holder" />
        <form action="">
          <label htmlFor="price">price</label>
          <input type="text" id="price" name="price" />
          <label htmlFor="amount">amount</label>
          <input type="number" id="amount" name="amount" />
          <p>
            MaxAvailable:<span>1.234 ETH</span>
          </p>
          <p>
            Click <a href="">here</a> to view the contract on Etherscan. By
            placing a bid you confirm that you have read and agree to the 
            <a href="">terms of sale</a> for this drop. Your bid will be
            refunded if you lose the auction.
          </p>
          <button type="submit">Mint</button>
        </form>
      </main>
    </div>
  );
}

export default App;
