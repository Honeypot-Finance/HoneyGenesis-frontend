import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import GeneralButton from "../atoms/GeneralButton/GeneralButton";
import walletIcon from "@/assets/wallet-icon.jpg";

export default function WalletConnectButton() {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const { isConnected, isConnecting } = useAccount();

  const isConnectingDisplay = <div>Connecting...</div>;

  const isConnectedDisplay = (
    <>
      {address && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            style={{
              width: "1.5rem",
              height: "1.5rem",
              marginRight: "0.5rem",
              borderRadius: "50%",
            }}
            src={walletIcon}
            alt=""
          />
          {address.toString().substring(0, 3)}...
          {address
            .toString()
            .substring(
              address.toString().length - 3,
              address.toString().length
            )}
        </div>
      )}
    </>
  );

  return (
    <GeneralButton
      onClick={() => open()}
      style={{
        padding: "0.5rem 1rem",
        fontSize: "1rem",
        borderWidth: "0.2rem",
        borderRadius: "1rem",
      }}
    >
      {isConnecting
        ? isConnectingDisplay
        : isConnected
        ? isConnectedDisplay
        : "Connect"}
    </GeneralButton>
  );
}
