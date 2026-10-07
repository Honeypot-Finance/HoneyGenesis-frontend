import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "@/css/home.css";
import WalletConnectButton from "@/components/walletConnect/WalletConnectConnectButton";
import honeyTopFrame from "@/assets/honey-top-frame.png";
import honeypotBrandIcon from "@/assets/honeypot_brand_icon_brown_yellow.svg";

//icons
import arrowUpRight from "@/assets/arrow_up_right.svg";

export default function Header() {
  const location = useLocation();
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
      if (window.innerWidth <= 1080) {
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
        <div
          className="close-header-button"
          ref={closeHeaderButton}
        >
          X
        </div>
        <div
          className="header-bg"
          style={{ backgroundImage: `url(${honeyTopFrame})` }}
        />
        <Link to={"/"} style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <img
            src={honeypotBrandIcon}
            alt="logo"
            className="logo"
          />
          <span style={{ color: "#3B2712", fontSize: "1.2rem", fontWeight: "900", fontFamily: "'Bebas Neue', sans-serif", textTransform: "uppercase", letterSpacing: "-0.02em" }}>Honeypot NFT</span>
        </Link>
        <div className="link-group">
          <nav className="navbar">
            <Link to="/benefits" className={`navbar__link ${location.pathname === '/benefits' ? 'active' : ''}`}>
              Benefits
            </Link>
            <hr />
            <Link to="/staking" className={`navbar__link ${location.pathname === '/staking' ? 'active' : ''}`}>
              Staking
            </Link>
            <hr />
            <Link to="/reveal" className={`navbar__link ${location.pathname === '/reveal' ? 'active' : ''}`}>
              Gallery
            </Link>
            <hr />
            {/* <Link to="/mint" className="navbar__link">
              Mint
            </Link>
            <hr /> */}
            {/* <Link to="/vip-mint" className="navbar__link">
              Priority Mint
            </Link>
            <hr /> */}
            {/* <Link to="/whitelist-check" className="navbar__link">
              Whitelist
            </Link> */}
            <hr />
            <a
              href="https://honeypotfinance.xyz/"
              target="blank"
              className="navbar__link"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              Honeypot Finance
              <img
                src={arrowUpRight}
                alt=""
                style={{ display: "inline-block", verticalAlign: "middle", scale: "75%", opacity: "0.5" }}
              />
            </a>
          </nav>
        </div>
        <WalletConnectButton />
      </header>
    </>
  );
}
