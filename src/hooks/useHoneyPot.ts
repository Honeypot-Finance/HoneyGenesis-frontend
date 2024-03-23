import { useReadContract } from "wagmi";
import { contracts, kingdomlyFee, acceptChainId } from "@/consts";
import HoneyGenesis from "@/abi/HoneyGenesis.json";
import { useAccount } from "wagmi";
import { weiToEther } from "@/lib/currencyConvert";

export default function useHoneyPot() {
  const { chainId: currentChainId } = useAccount();

  const currentprice = useReadGenesisContract("getCurrentPrice");
  const nextPrice = useReadGenesisContract("getNextNFTPrice");
  const mintedAmount = useReadGenesisContract("tokenCountNormal");
  const maxAmount = useReadGenesisContract("TOTAL_SUPPLY_CAP");
  const totalVIPNFTCount = useReadGenesisContract("getTotalVIPNFTCount");
  const mintedVIPNFTsCount = useReadGenesisContract("tokenCountVIP");
  const VIPPrice = useReadGenesisContract("getVIPPrice");
  const nftBaseURI = useReadGenesisContract("tokenURI");

  const useVIPMintQuota = (address: string) =>
    useReadGenesisContract("getVIPMintQuota", address);

  function useReadGenesisContract(functionName, ...args: string[]) {
    const res = useReadContract({
      abi: HoneyGenesis.abi,
      chainId: currentChainId ? currentChainId : acceptChainId[0],
      functionName: functionName,
      address: currentChainId
        ? contracts[currentChainId]
        : contracts[acceptChainId[0]],
      args: args,
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
    if (mintedVIPNFTsCount.error) console.log(mintedVIPNFTsCount.error);
    if (mintedVIPNFTsCount.data == undefined) {
      return "loading";
    }
    return mintedVIPNFTsCount.isPending
      ? "loading"
      : (mintedVIPNFTsCount.data.toString() as string);
  }

  function getVIPNFTPrice() {
    if (VIPPrice.error) console.log(VIPPrice.error);
    if (VIPPrice.data == undefined) {
      return "loading";
    }
    return VIPPrice.isPending
      ? "loading"
      : (VIPPrice.data.toString() as string);
  }

  function getTotalPrice(vip, mintAmount) {
    const nftPrice = weiToEther(
      parseInt(vip ? getVIPNFTPrice() : getCurrentPrice())
    );
    const totalPrice = nftPrice * mintAmount;

    if (mintAmount <= 0 || nftPrice <= 0) return 0;
    return totalPrice;
  }

  function getKingdomlyFee(vip, mintAmount) {
    const price = getTotalPrice(vip, mintAmount);
    const commission = price * 0.03;
    return kingdomlyFee * mintAmount + commission;
  }

  function getTotalPriceWithFee(vip, mintAmount) {
    return getTotalPrice(vip, mintAmount) + getKingdomlyFee(vip, mintAmount);
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
    VIPPrice,
    useVIPMintQuota,
    nftBaseURI,
    getTotalPrice,
    getKingdomlyFee,
    getTotalPriceWithFee,
  };
}
