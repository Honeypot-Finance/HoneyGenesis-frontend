import { useEffect, useRef } from "react";
import "@/css/home.css";
import WalletConnectButton from "@/components/walletConnect/WalletConnectConnectButton";

export default function Header() {
  const closeHeaderButton = useRef<HTMLDivElement>(null);
  const openHeaderButton = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeHeaderButton.current?.addEventListener("click", () => {
      closeHeaderButton.current?.parentElement?.classList.add("closed");
      openHeaderButton.current?.classList.remove("hide");
    });

    openHeaderButton.current?.addEventListener("click", () => {
      closeHeaderButton.current?.parentElement?.classList.remove("closed");
      openHeaderButton.current?.classList.add("hide");
    });
  }, []);

  return (
    <>
      <div className="open-header-button" ref={openHeaderButton}>
        <p>Open Menu</p>
      </div>
      <header className="App-header closed">
        <div className="close-header-button" ref={closeHeaderButton}>
          X
        </div>
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
            <a href="">Priority Mint</a>
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
        <WalletConnectButton />
      </header>
    </>
  );
}
