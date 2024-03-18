import { useReadContract } from "wagmi";
import { contracts } from "@/consts";
import HoneyGenesis from "@/abi/HoneyGenesis.json";
import { useChainId } from "wagmi";

export default function useHoneyPot() {
  const currentChainId = useChainId();
  const currentprice = useReadGenesisContract("getCurrentPrice");
  const nextPrice = useReadGenesisContract("getNextNFTPrice");
  const mintedAmount = useReadGenesisContract("getMintedNFTsCount");
  const maxAmount = useReadGenesisContract("getTotalNFTCount");
  const totalVIPNFTCount = useReadGenesisContract("getTotalVIPNFTCount");
  const mintedVIPNFTsCount = useReadGenesisContract("getMintedVIPNFTsCount");

  function useReadGenesisContract(functionName) {
    const res = useReadContract({
      abi: HoneyGenesis.abi,
      chainId: currentChainId,
      functionName: functionName,
      address: contracts[currentChainId],
    });

    return res;
  }

  function getCurrentPrice() {
    if (currentprice.error) console.log(currentprice.error);
    if (currentprice.data == undefined) {
      return "loading";
    }
    return currentprice.isPending
      ? "loading"
      : (currentprice.data.toString() as string);
  }

  function getMintedAmount() {
    if (mintedAmount.error) console.log(mintedAmount.error);
    if (mintedAmount.data == undefined) {
      return "loading";
    }
    return mintedAmount.isPending
      ? "loading"
      : (mintedAmount.data.toString() as string);
  }

  function getMaxAmount() {
    if (maxAmount.error) console.log(maxAmount.error);
    if (maxAmount.data == undefined) {
      return "loading";
    }
    return maxAmount.isPending
      ? "loading"
      : (maxAmount.data.toString() as string);
  }

  function getNextPrice() {
    if (nextPrice.error) console.log(nextPrice.error);
    if (nextPrice.data == undefined) {
      return "loading";
    }
    return nextPrice.isPending
      ? "loading"
      : (nextPrice.data.toString() as string);
  }

  function getTotalVIPNFTCount() {
    if (totalVIPNFTCount.error) console.log(totalVIPNFTCount.error);
    if (totalVIPNFTCount.data == undefined) {
      return "loading";
    }

    return totalVIPNFTCount.isPending
      ? "loading"
      : (totalVIPNFTCount.data.toString() as string);
  }

  function getMintedVIPNFTsCount() {
    console.log(mintedVIPNFTsCount);
    if (mintedVIPNFTsCount.error) console.log(mintedVIPNFTsCount.error);
    if (mintedVIPNFTsCount.data == undefined) {
      return "loading";
    }
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
