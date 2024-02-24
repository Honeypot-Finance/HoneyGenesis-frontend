import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useReadContract } from "wagmi";


export default function useHoneyPOt() {
    const { address} = useAccount()

    function getCurrentPrice() {
        if(!address) return null;



        return 100
      }
    
    return {
        getCurrentPrice,
        getNextPrice,
        getMintedAmount,
        getMaxAmount
    }
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
