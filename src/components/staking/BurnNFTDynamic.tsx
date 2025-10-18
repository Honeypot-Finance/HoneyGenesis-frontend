import { useState, useEffect } from "react";
import GeneralButton from "../atoms/GeneralButton/GeneralButton";
import { useWriteContract, useWaitForTransactionReceipt, useSimulateContract } from "wagmi";
import { NFTStakingABI } from "@/abi/NFTStakingABI";
import { DEFAULT_STAKING_CHAIN_ID } from "@/consts";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";

interface BurnNFTDynamicProps {
  stakingContractAddress: `0x${string}`;
}

export function BurnNFTDynamic({ stakingContractAddress }: BurnNFTDynamicProps) {
  const [tokenId, setTokenId] = useState("");
  const dispatch = useAppDispatch();

  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Simulation for logging
  const { data: simulationData, error: simulationError, isLoading: isSimulating } = useSimulateContract({
    address: stakingContractAddress,
    abi: NFTStakingABI,
    functionName: 'burn',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    chainId: DEFAULT_STAKING_CHAIN_ID,
    query: {
      enabled: !!tokenId,
    },
  });

  // Log simulation results
  useEffect(() => {
    if (tokenId) {
      console.log("Burn simulation for token", tokenId, ":", {
        isSimulating,
        simulationData,
        simulationError,
      });
    }
  }, [tokenId, isSimulating, simulationData, simulationError]);

  // Log burn errors
  useEffect(() => {
    if (error) {
      console.log("Burn error:", error);
    }
  }, [error]);

  const handleBurn = () => {
    if (!tokenId) return;

    console.log("Burning NFT - Token ID:", tokenId, "from contract:", stakingContractAddress);

    writeContract({
      address: stakingContractAddress,
      abi: NFTStakingABI,
      functionName: 'burn',
      args: [BigInt(tokenId)],
      chainId: DEFAULT_STAKING_CHAIN_ID,
    });
  };

  if (isSuccess && hash) {
    dispatch(
      openPopUp({
        title: "Burn Success",
        message: `NFT burned successfully!\n\nHash: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
        info: "success",
      })
    );
  }

  return (
    <div>
      <div className="info-box" style={{ marginBottom: '1.5rem', background: 'rgba(255, 73, 74, 0.1)', border: '2px solid #FF494A' }}>
        <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#FF494A', margin: 0 }}>
          ⚠️ Warning
        </p>
        <p style={{ fontSize: '0.75rem', color: '#999999', marginTop: '0.5rem' }}>
          Burning your NFT is permanent and irreversible. The NFT will be destroyed, and you will enter burn mode to earn bonus rewards.
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#ffcd4d', marginBottom: '0.5rem' }}>
          Token ID to Burn
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
        onClick={handleBurn}
        loading={isPending || isConfirming}
        disabled={!tokenId}
        style={{ width: "100%", background: isPending || isConfirming ? "#666666" : "#FF494A" }}
      >
        {isPending || isConfirming ? "Burning..." : "Burn NFT"}
      </GeneralButton>
    </div>
  );
}
