import { useState } from "react";
import GeneralButton from "../atoms/GeneralButton/GeneralButton";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { NFTStakingABI } from "@/abi/NFTStakingABI";
import { DEFAULT_STAKING_CHAIN_ID } from "@/consts";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";

interface UnstakeNFTDynamicProps {
  stakingContractAddress: `0x${string}`;
}

export function UnstakeNFTDynamic({ stakingContractAddress }: UnstakeNFTDynamicProps) {
  const [tokenId, setTokenId] = useState("");
  const dispatch = useAppDispatch();

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleUnstake = () => {
    if (!tokenId) return;

    console.log("Unstaking NFT - Token ID:", tokenId, "from contract:", stakingContractAddress);

    writeContract({
      address: stakingContractAddress,
      abi: NFTStakingABI,
      functionName: 'unstake',
      args: [BigInt(tokenId)],
      chainId: DEFAULT_STAKING_CHAIN_ID,
    });
  };

  if (isSuccess && hash) {
    dispatch(
      openPopUp({
        title: "Unstake Success",
        message: `NFT unstaked successfully!\n\nHash: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
        info: "success",
      })
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#ffcd4d', marginBottom: '0.5rem' }}>
          Token ID to Unstake
        </label>
        <input
          type="number"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="Enter token ID"
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '0.9rem',
            backgroundColor: '#1a1a1a',
            border: '2px solid #333',
            borderRadius: '8px',
            color: '#fff',
          }}
        />
      </div>

      <GeneralButton
        onClick={handleUnstake}
        loading={isPending || isConfirming}
        disabled={!tokenId}
        style={{ width: "100%" }}
      >
        {isPending || isConfirming ? "Unstaking..." : "Unstake NFT"}
      </GeneralButton>
    </div>
  );
}
