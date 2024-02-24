import {   useReadContract } from "wagmi";

import HoneyGenesis from "@/abi/HoneyGenesis.json"

const contractAddress = "0xd1633D9C0308f697151C88e231647C1E5248FB1F";
const chainId = 421614;

function useReadGenesisContract(functionName) {
  const res = useReadContract({
    abi: HoneyGenesis.abi,
    chainId: chainId,
    functionName: functionName,
    address: contractAddress,
  });
  

  return res.isPending ? "loading" : res.data.toString() as string;
}


export default function useHoneyPOt() {
    const currentprice = useReadGenesisContract("getCurrentPrice");
    const nextPrice = useReadGenesisContract("getNextNFTPrice");
    const mintedAmount = useReadGenesisContract("getMintedNFTsCount");
    const maxAmount = useReadGenesisContract("totalSupply");


    function getCurrentPrice() {
        return currentprice;
      }

    function getMintedAmount() {
        return mintedAmount;
      }

    function getMaxAmount() {
        return maxAmount;
      }

    function getNextPrice() {
        return nextPrice;
      }

    return {
        getCurrentPrice,
        getNextPrice,
        getMintedAmount,
        getMaxAmount
    }
}

