import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";


function getCurrentPrice() {
  const { address, isConnecting, isDisconnected } = useAccount()
  
  return 100
}

function getNextPrice() {
    return 230
    }

function getMintedAmount() {
  return 1000
}

function getMaxAmount() {
  return 5000
}



export {
    getCurrentPrice,
  getNextPrice,
  getMintedAmount,
  getMaxAmount
}