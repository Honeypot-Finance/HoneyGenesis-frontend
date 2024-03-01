import { useReadContract } from "wagmi";
import { chainId, contractAddress } from "@/consts";
import HoneyGenesis from "@/abi/HoneyGenesis.json";

export default function useHoneyPOt() {
  const currentprice = useReadGenesisContract("getCurrentPrice");
  const nextPrice = useReadGenesisContract("getNextNFTPrice");
  const mintedAmount = useReadGenesisContract("getMintedNFTsCount");
  const maxAmount = useReadGenesisContract("getTotalNFTCount");

  function useReadGenesisContract(functionName) {
    const res = useReadContract({
      abi: HoneyGenesis.abi,
      chainId: chainId,
      functionName: functionName,
      address: contractAddress,
    });

    if (functionName === "getMintedNFTsCount") {
      console.log(res);
    }

    return res.isPending ? "loading" : (res.data.toString() as string);
  }

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
    getMaxAmount,
  };
}
