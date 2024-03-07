import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "@/css/home.css";
import WalletConnectButton from "@/components/walletConnect/WalletConnectConnectButton";
import honeyTopFrame from "@/assets/honey-top-frame.png";
import honeyGenesisLogo from "@/assets/honey-genesis-icon.png";

export default function Header() {
  const closeHeaderButton = useRef<HTMLDivElement>(null);
  const openHeaderButton = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //add event listeners to open and close header buttons
    closeHeaderButton.current?.addEventListener("click", () => {
      closeHeaderButton.current?.parentElement?.classList.add("closed");
      openHeaderButton.current?.classList.remove("header-closed");
    });

    openHeaderButton.current?.addEventListener("click", () => {
      closeHeaderButton.current?.parentElement?.classList.remove("closed");
      openHeaderButton.current?.classList.add("header-closed");
    });

    //close header on mobile after navigation
    setTimeout(() => {
      if (window.innerWidth < 1024) {
        closeHeaderButton.current?.parentElement?.classList.add("closed");
        openHeaderButton.current?.classList.remove("header-closed");
      }
    }, 200);
  }, []);

  return (
    <>
      <div
        className="open-header-button header-closed"
        ref={openHeaderButton}
        style={{ backgroundImage: `url(${honeyTopFrame})` }}
      ></div>
      <header className="App-header">
        <div className="close-header-button" ref={closeHeaderButton}>
          X
        </div>
        <div
          className="header-bg"
          style={{ backgroundImage: `url(${honeyTopFrame})` }}
        />
        <img src={honeyGenesisLogo} alt="logo" className="logo" />
        <div className="link-group">
          <nav className="navbar">
            <li className="navbar__link">
              <a href="">Honeypot Finance</a>
            </li>
            <hr />
            <li className="navbar__link">
              <a href="">My Assets</a>
            </li>
            <hr />
            <li className="navbar__link">
              <Link to="/">Mint</Link>
            </li>
            <hr />
            <li className="navbar__link">
              <Link to="/vip-mint">Priority Mint</Link>
            </li>
          </nav>
          <div className="medias">
            <a
              className="medias__link"
              href="https://twitter.com/honeypotfinance"
              target="_blank"
            >
              Twitter
            </a>
            <a
              className="medias__link"
              href="https://discord.com/invite/8Z3VdhZ9V6"
              target="_blank"
            >
              Discord
            </a>
            <a
              className="medias__link"
              href="https://docs.honeypotfinance.xyz/"
              target="_blank"
            >
              Gitbook
            </a>
          </div>
        </div>
        <WalletConnectButton />
      </header>
    </>
  );
}
