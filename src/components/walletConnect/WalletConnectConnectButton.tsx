import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import GeneralButton from "../atoms/general-buttom/GeneralButton";

export default function WalletConnectButton() {
  const { open } = useWeb3Modal();
  const { isConnected, isConnecting } = useAccount();

  const isConnectingDisplay = <div>Connecting...</div>;

  const isConnectedDisplay = <div>Wallet</div>;

  return (
    <GeneralButton onClick={() => open()}>
      {isConnecting
        ? isConnectingDisplay
        : isConnected
        ? isConnectedDisplay
        : "Connect Wallet"}
    </GeneralButton>
  );
}
