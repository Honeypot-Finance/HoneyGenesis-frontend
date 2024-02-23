import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function WalletConnectButton() {
  const { open } = useWeb3Modal();

  return (
    <div className="connect-button-container">
      <button className="connnect-wallet-button" onClick={() => open()}>
        Connect Wallet
      </button>
    </div>
  );
}
