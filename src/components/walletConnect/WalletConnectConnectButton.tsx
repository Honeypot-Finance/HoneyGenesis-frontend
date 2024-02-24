import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

export default function WalletConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected, isConnecting } = useAccount();

  const isConnectingDisplay = <div>Connecting...</div>;

  const isConnectedDisplay = (
    <>
      <div>Connected: </div>
      <div>
        <button onClick={() => open()}>{address}</button>
      </div>
    </>
  );

  const buttonDisplay = (
    <button className="connnect-wallet-button" onClick={() => open()}>
      Connect Wallet
    </button>
  );

  return (
    <div className="connect-button-container">
      {isConnecting
        ? isConnectingDisplay
        : isConnected
        ? isConnectedDisplay
        : buttonDisplay}
    </div>
  );
}
