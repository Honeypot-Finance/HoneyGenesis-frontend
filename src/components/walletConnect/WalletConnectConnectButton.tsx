import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

export default function WalletConnectButton() {
  const { open } = useWeb3Modal();
  const { isConnected, isConnecting } = useAccount();

  const isConnectingDisplay = <div>Connecting...</div>;

  const isConnectedDisplay = <div>Wallet</div>;

  return (
    <div className="connect-button-container">
      <button className="connnect-wallet-button" onClick={() => open()}>
        {isConnecting
          ? isConnectingDisplay
          : isConnected
          ? isConnectedDisplay
          : "Connect Wallet"}
      </button>
    </div>
  );
}
