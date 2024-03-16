import { useReadContract } from "wagmi";
import { chainId, contractAddress } from "@/consts";
import HoneyGenesis from "@/abi/HoneyGenesis.json";

export default function useHoneyPot() {
  const currentprice = useReadGenesisContract("getCurrentPrice");
  const nextPrice = useReadGenesisContract("getNextNFTPrice");
  const mintedAmount = useReadGenesisContract("getMintedNFTsCount");
  const maxAmount = useReadGenesisContract("getTotalNFTCount");
  const totalVIPNFTCount = useReadGenesisContract("getTotalVIPNFTCount");
  const mintedVIPNFTsCount = useReadGenesisContract("getMintedVIPNFTsCount");

  function useReadGenesisContract(functionName) {
    const res = useReadContract({
      abi: HoneyGenesis.abi,
      chainId: chainId,
      functionName: functionName,
      address: contractAddress,
    });

    return res;
  }

  function getCurrentPrice() {
    return currentprice.isPending
      ? "loading"
      : (currentprice.data.toString() as string);
  }

  function getMintedAmount() {
    return mintedAmount.isPending
      ? "loading"
      : (mintedAmount.data.toString() as string);
  }

  function getMaxAmount() {
    return maxAmount.isPending
      ? "loading"
      : (maxAmount.data.toString() as string);
  }

  function getNextPrice() {
    if (!nextPrice.data) return "loading";
    return nextPrice.isPending
      ? "loading"
      : (nextPrice.data.toString() as string);
  }

  function getTotalVIPNFTCount() {
    return totalVIPNFTCount.isPending
      ? "loading"
      : (totalVIPNFTCount.data.toString() as string);
  }

  function getMintedVIPNFTsCount() {
    return mintedVIPNFTsCount.isPending
      ? "loading"
      : (mintedVIPNFTsCount.data.toString() as string);
  }

  function getVIPNFTPrice() {
    return "69000000000000000";
  }

  return {
    getCurrentPrice,
    getNextPrice,
    getMintedAmount,
    getMaxAmount,
    getTotalVIPNFTCount,
    getMintedVIPNFTsCount,
    getVIPNFTPrice,
    currentprice,
    nextPrice,
    mintedAmount,
    maxAmount,
    totalVIPNFTCount,
    mintedVIPNFTsCount,
  };
}
