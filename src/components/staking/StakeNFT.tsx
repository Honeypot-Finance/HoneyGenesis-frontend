import { useState, useEffect } from "react";
import { useStake } from "@/hooks/useNFTStaking";
import { useSetApprovalForAll, useIsApproved } from "@/hooks/useNFT";
import { NFTSelector } from "./NFTSelector";
import GeneralButton from "../atoms/GeneralButton/GeneralButton";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";

export function StakeNFT() {
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
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

  const getExplorerUrl = (hash: string) => {
    return `https://testnet.berascan.com/tx/${hash}`;
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
      const timer = setTimeout(() => {
        setRefetchTrigger((prev) => prev + 1);
        setSelectedTokenId(undefined);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, stakeHash, dispatch]);

  useEffect(() => {
    if (isApproveSuccess && approveHash) {
      dispatch(
        openPopUp({
          title: "Approval Success",
          message: `All NFTs approved successfully! You can now stake any NFT.\n\nTransaction: ${approveHash.slice(
            0,
            10
          )}...${approveHash.slice(-8)}`,
          info: "success",
          link: getExplorerUrl(approveHash),
          linkText: "View on Explorer",
        })
      );
      // Force a refetch by updating the key
      const timer = setTimeout(() => {
        setRefetchTrigger((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isApproveSuccess, approveHash, dispatch]);

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
        onSelect={setSelectedTokenId}
        selectedTokenId={selectedTokenId}
        mode="wallet"
        title="Select NFT to Stake"
        key={refetchTrigger}
      />

      {!isApprovedForAll && (
        <GeneralButton
          onClick={handleApprove}
          loading={isApproving || isApprovingConfirming}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {isApproving || isApprovingConfirming
            ? "Approving..."
            : "Approve NFTs"}
        </GeneralButton>
      )}

      {selectedTokenId !== undefined && isApproved && (
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
}
