import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useStake } from "@/hooks/useNFTStaking";
import { useSetApprovalForAll, useIsApproved } from "@/hooks/useNFT";
import { NFTSelector, NFTSelectorRef } from "./NFTSelector";
import GeneralButton from "../atoms/GeneralButton/GeneralButton";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";

export interface StakeNFTRef {
  refetchWalletNFTs: () => Promise<void>;
}

export const StakeNFT = forwardRef<StakeNFTRef>((props, ref) => {
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | undefined>();
  const walletNFTSelectorRef = useRef<NFTSelectorRef>(null);
  const {
    stake,
    isPending: isStaking,
    isConfirming,
    isSuccess,
    hash: stakeHash,
  } = useStake();
  const {
    setApprovalForAll,
    isPending: isApproving,
    isConfirming: isApprovingConfirming,
    isSuccess: isApproveSuccess,
    hash: approveHash,
  } = useSetApprovalForAll();
  const { isApproved, isApprovedForAll } = useIsApproved(selectedTokenId);
  const dispatch = useAppDispatch();

  // Expose refetch function to parent via ref
  useImperativeHandle(ref, () => ({
    refetchWalletNFTs: async () => {
      await walletNFTSelectorRef.current?.refetch();
    },
  }));

  const getExplorerUrl = (hash: string) => {
    return `https://berascan.com/tx/${hash}`;
  };

  useEffect(() => {
    if (isSuccess && stakeHash) {
      dispatch(
        openPopUp({
          title: "Stake Success",
          message: `NFT staked successfully!\n\nTransaction: ${stakeHash.slice(
            0,
            10
          )}...${stakeHash.slice(-8)}`,
          info: "success",
          link: getExplorerUrl(stakeHash),
          linkText: "View on Explorer",
        })
      );

      // Poll for subgraph updates with exponential backoff
      const refetchWithRetry = async (attempts = 0, maxAttempts = 5) => {
        if (attempts >= maxAttempts) {
          console.log('Max refetch attempts reached');
          setSelectedTokenId(undefined);
          return;
        }

        // Wait with exponential backoff: 2s, 4s, 6s, 8s, 10s
        const delay = 2000 * (attempts + 1);
        await new Promise(resolve => setTimeout(resolve, delay));

        console.log(`Refetching NFTs (attempt ${attempts + 1}/${maxAttempts})...`);
        await walletNFTSelectorRef.current?.refetch();

        // Continue polling
        refetchWithRetry(attempts + 1, maxAttempts);
      };

      refetchWithRetry();
      setSelectedTokenId(undefined);
    }
  }, [isSuccess, stakeHash, dispatch]);

  useEffect(() => {
    if (isApproveSuccess && approveHash && selectedTokenId && !isStaking && !isConfirming) {
      dispatch(
        openPopUp({
          title: "Approval Success",
          message: `All NFTs approved successfully! Initiating stake transaction...\n\nTransaction: ${approveHash.slice(
            0,
            10
          )}...${approveHash.slice(-8)}`,
          info: "success",
          link: getExplorerUrl(approveHash),
          linkText: "View on Explorer",
        })
      );

      // Automatically trigger stake after approval
      stake(selectedTokenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproveSuccess, approveHash, selectedTokenId, dispatch]);

  const handleApprove = () => {
    setApprovalForAll(true);
  };

  const handleStake = () => {
    if (selectedTokenId === undefined) return;
    stake(selectedTokenId);
  };

  return (
    <div>
      <NFTSelector
        ref={walletNFTSelectorRef}
        onSelect={setSelectedTokenId}
        selectedTokenId={selectedTokenId}
        mode="wallet"
        title="Select NFT to Stake"
      />

      {selectedTokenId !== undefined && !isApprovedForAll && (
        <GeneralButton
          onClick={handleApprove}
          loading={isApproving || isApprovingConfirming || isStaking || isConfirming}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {isApproving || isApprovingConfirming
            ? "Approving..."
            : isStaking || isConfirming
            ? "Staking..."
            : "Approve & Stake NFT"}
        </GeneralButton>
      )}

      {selectedTokenId !== undefined && isApprovedForAll && (
        <GeneralButton
          onClick={handleStake}
          loading={isStaking || isConfirming}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {isStaking || isConfirming ? "Staking..." : "Stake NFT"}
        </GeneralButton>
      )}
    </div>
  );
});
