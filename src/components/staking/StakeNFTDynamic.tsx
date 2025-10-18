import { useState } from "react";
import GeneralButton from "../atoms/GeneralButton/GeneralButton";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { NFTStakingABI } from "@/abi/NFTStakingABI";
import { DEFAULT_STAKING_CHAIN_ID } from "@/consts";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";

interface StakeNFTDynamicProps {
  stakingContractAddress: `0x${string}`;
  nftContractAddress: `0x${string}`;
}

export function StakeNFTDynamic({ stakingContractAddress, nftContractAddress }: StakeNFTDynamicProps) {
  const [tokenId, setTokenId] = useState("");
  const dispatch = useAppDispatch();

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const { data: isApprovedForAll } = useReadContract({
    address: nftContractAddress,
    abi: [
      {
        type: 'function',
        name: 'isApprovedForAll',
        stateMutability: 'view',
        inputs: [
          { name: 'owner', type: 'address' },
          { name: 'operator', type: 'address' }
        ],
        outputs: [{ name: '', type: 'bool' }],
      },
    ],
    functionName: 'isApprovedForAll',
    args: [stakingContractAddress, stakingContractAddress],
    chainId: DEFAULT_STAKING_CHAIN_ID,
  });

  const handleApprove = () => {
    writeContract({
      address: nftContractAddress,
      abi: [
        {
          type: 'function',
          name: 'setApprovalForAll',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'operator', type: 'address' },
            { name: 'approved', type: 'bool' }
          ],
          outputs: [],
        },
      ],
      functionName: 'setApprovalForAll',
      args: [stakingContractAddress, true],
      chainId: DEFAULT_STAKING_CHAIN_ID,
    });
  };

  const handleStake = () => {
    if (!tokenId) return;

    console.log("Staking NFT - Token ID:", tokenId, "to contract:", stakingContractAddress);

    writeContract({
      address: stakingContractAddress,
      abi: NFTStakingABI,
      functionName: 'stake',
      args: [BigInt(tokenId)],
      chainId: DEFAULT_STAKING_CHAIN_ID,
    });
  };

  if (isSuccess && hash) {
    dispatch(
      openPopUp({
        title: "Transaction Success",
        message: `Transaction confirmed!\n\nHash: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
        info: "success",
      })
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#ffcd4d', marginBottom: '0.5rem' }}>
          Token ID to Stake
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

      {!isApprovedForAll && (
        <GeneralButton
          onClick={handleApprove}
          loading={isPending || isConfirming}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          {isPending || isConfirming ? "Approving..." : "Approve NFTs"}
        </GeneralButton>
      )}

      <GeneralButton
        onClick={handleStake}
        loading={isPending || isConfirming}
        disabled={!tokenId}
        style={{ width: "100%" }}
      >
        {isPending || isConfirming ? "Staking..." : "Stake NFT"}
      </GeneralButton>
    </div>
  );
}
