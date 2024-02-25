import { useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { chainId, contractAddress } from "@/consts";
import HoneyGenesis from "@/abi/HoneyGenesis.json";

export default function MintNFTButton() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  function mintNFT(amount: number) {
    writeContract({
      abi: HoneyGenesis.abi,
      chainId: chainId,
      functionName: `mint(${address},${amount})`,
      address: contractAddress,
    });
  }

  return (
    <button className="mint-button" type="submit" onClick={() => mintNFT(1)}>
      Mint
    </button>
  );
}
