import { useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { contracts } from "@/consts";
import HoneyGenesis from "@/abi/HoneyGenesis.json";

export default function MintNFTButton() {
  const { address, chainId } = useAccount();
  const { writeContract } = useWriteContract();

  function mintNFT(amount: number) {
    writeContract({
      abi: HoneyGenesis.abi,
      chainId: chainId,
      functionName: `mint(${address},${amount})`,
      address: contracts[chainId],
    });
  }

  return (
    <button className="mint-button" type="submit" onClick={() => mintNFT(1)}>
      Mint
    </button>
  );
}
