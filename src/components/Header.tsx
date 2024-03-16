import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "@/css/home.css";
import WalletConnectButton from "@/components/walletConnect/WalletConnectConnectButton";
import honeyTopFrame from "@/assets/honey-top-frame.png";
import honeyGenesisLogo from "@/assets/brand-header-icon.svg";

//icons
import discordIcon from "@/assets/icon-discord.svg";
import twitterIcon from "@/assets/icon-twitter.svg";
import gitbookIcon from "@/assets/icon-gitbook.svg";

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
    }, 300);
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
        <Link to={"/"}>
          <img src={honeyGenesisLogo} alt="logo" className="logo" />
        </Link>
        <div className="link-group">
          <nav className="navbar">
            <li className="navbar__link">
              <a href="https://honeypotfinance.xyz/" target="blank">
                Honeypot Finance
              </a>
            </li>
            <hr />
            <li className="navbar__link">
              <Link to="/my-assets">My Assets</Link>
            </li>
            <hr />
            <li className="navbar__link">
              <Link to="/mint">Mint</Link>
            </li>{" "}
            <hr />
            <li className="navbar__link">
              <Link to="/whitelist-check">Whitelist</Link>
            </li>
            {/* <hr />
            <li className="navbar__link">
              <Link to="/vip-mint">Priority Mint</Link>
            </li> */}
          </nav>
          <div className="medias">
            <a
              className="medias__link"
              href="https://twitter.com/honeypotfinance"
              target="_blank"
            >
              <img src={twitterIcon} alt="Twitter" />
            </a>
            <a
              className="medias__link"
              href="https://discord.com/invite/8Z3VdhZ9V6"
              target="_blank"
            >
              <img src={discordIcon} alt="Discord" />
            </a>
            <a
              className="medias__link"
              href="https://docs.honeypotfinance.xyz/"
              target="_blank"
            >
              <img src={gitbookIcon} alt="Gitbook" />
            </a>
          </div>
        </div>
        <WalletConnectButton />
      </header>
    </>
  );
}
