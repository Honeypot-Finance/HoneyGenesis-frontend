import React, { useEffect, useRef } from "react";
import "@/css/home.css";

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
          <li className="navbar__link">Honeypot Finance</li>
          <hr />
          <li className="navbar__link">My Assets</li>
        </nav>
        <div className="medias">
          <a className="medias__link" href="">
            Twitter
          </a>
          <a className="medias__link" href="">
            Discord
          </a>
          <a className="medias__link" href="">
            Gitbook
          </a>
        </div>
        <div className="connect-button-container">
          <button className="connnect-wallet-button">
            <p>Connect Wallet</p>
          </button>
        </div>
      </header>
    </>
  );
}
