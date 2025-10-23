import { useState, useEffect, useRef } from "react";
import { useBatchBurn, useStakingParams } from "@/hooks/useNFTStaking";
import { useSetApprovalForAll, useIsApproved } from "@/hooks/useNFT";
import { formatBps } from "@/lib/stakingUtils";
import { NFTSelector, NFTSelectorRef } from "./NFTSelector";
import GeneralButton from "../atoms/GeneralButton/GeneralButton";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";
import { useUserNFTs } from "@/hooks/useUserNFTs";

export function BurnNFT() {
  const [selectedTokenIds, setSelectedTokenIds] = useState<bigint[]>([]);
  const burnableNFTSelectorRef = useRef<NFTSelectorRef>(null);
  const { batchBurn, isPending, isConfirming, isSuccess, hash, allHashes, currentBatch, totalBatches, error } = useBatchBurn();
  const {
    setApprovalForAll,
    isPending: isApproving,
    isConfirming: isApprovingConfirming,
    isSuccess: isApproveSuccess,
    hash: approveHash,
  } = useSetApprovalForAll();
  const { isApprovedForAll } = useIsApproved(selectedTokenIds[0]);
  const { burnBonusBps } = useStakingParams();
  const { nfts } = useUserNFTs("all-burnable");
  const dispatch = useAppDispatch();

  const getExplorerUrl = (txHash: string) => {
    return `https://berascan.com/tx/${txHash}`;
  };

  // Check if any selected NFTs are not staked (wallet NFTs need approval)
  const hasWalletNFTs = selectedTokenIds.some(tokenId => {
    const nft = nfts.find(n => n.tokenId === tokenId.toString());
    return nft && !nft.isStaked;
  });
  const needsApproval = hasWalletNFTs && !isApprovedForAll;

  useEffect(() => {
    if (isSuccess && allHashes && allHashes.length > 0) {
      const hashesText = allHashes.length === 1
        ? `Transaction: ${allHashes[0].slice(0, 10)}...${allHashes[0].slice(-8)}`
        : `${allHashes.length} transactions completed\nLast: ${allHashes[allHashes.length - 1].slice(0, 10)}...${allHashes[allHashes.length - 1].slice(-8)}`;

      dispatch(
        openPopUp({
          title: "Burn Success",
          message: `${selectedTokenIds.length} NFT${selectedTokenIds.length > 1 ? 's' : ''} burned successfully! You are now earning bonus rewards!\n\n${hashesText}`,
          info: "success",
          link: getExplorerUrl(allHashes[allHashes.length - 1]),
          linkText: "View Last Transaction",
        })
      );

      // Poll for subgraph updates with exponential backoff
      const refetchWithRetry = async (attempts = 0, maxAttempts = 5) => {
        if (attempts >= maxAttempts) {
          console.log("Max refetch attempts reached");
          setSelectedTokenIds([]);
          return;
        }

        // Wait with exponential backoff: 2s, 4s, 6s, 8s, 10s
        const delay = 2000 * (attempts + 1);
        await new Promise((resolve) => setTimeout(resolve, delay));

        console.log(
          `Refetching NFTs (attempt ${attempts + 1}/${maxAttempts})...`
        );
        await burnableNFTSelectorRef.current?.refetch();

        // Continue polling
        refetchWithRetry(attempts + 1, maxAttempts);
      };

      refetchWithRetry();
      setSelectedTokenIds([]);
    }
  }, [isSuccess, allHashes, dispatch, selectedTokenIds.length]);

  useEffect(() => {
    if (isApproveSuccess && approveHash && selectedTokenIds.length > 0 && !isPending && !isConfirming) {
      dispatch(
        openPopUp({
          title: "Approval Success",
          message: `All NFTs approved successfully! Initiating burn transaction...\n\nTransaction: ${approveHash.slice(
            0,
            10
          )}...${approveHash.slice(-8)}`,
          info: "success",
          link: getExplorerUrl(approveHash),
          linkText: "View on Explorer",
        })
      );

      // Automatically trigger batch burn after approval
      batchBurn(selectedTokenIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproveSuccess, approveHash, selectedTokenIds.length, dispatch]);

  // Log burn errors
  useEffect(() => {
    if (error) {
      console.log("Burn error:", error);
    }
  }, [error]);

  const handleApprove = () => {
    setApprovalForAll(true);
  };

  return (
    <div>
      {burnBonusBps && (
        <div
          className="info-box"
          style={{ marginBottom: "1.5rem" }}
        >
          <p
            style={{
              fontSize: "0.9rem",
              fontWeight: "bold",
              color: "#ffcd4d",
              margin: 0,
            }}
          >
            Burn Bonus:{" "}
            <span style={{ fontSize: "1.2rem" }}>
              1{formatBps(burnBonusBps)}
            </span>
          </p>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#999999",
              marginTop: "0.5rem",
            }}
          >
            Burning increases your rewards to this percentage
          </p>
        </div>
      )}

      <NFTSelector
        ref={burnableNFTSelectorRef}
        onSelect={() => {}} // Not used in multi-select mode
        onMultiSelect={setSelectedTokenIds}
        selectedTokenIds={selectedTokenIds}
        multiSelect={true}
        mode="all-burnable"
        title="Select NFTs to Burn"
      />

      <div
        className="info-box"
        style={{
          background: "rgba(255, 73, 74, 0.1)",
          border: "2px solid #FF494A",
          marginTop: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "0.9rem",
            fontWeight: "bold",
            color: "#FF494A",
            margin: 0,
          }}
        >
          ⚠️ Warning
        </p>
        <p
          style={{ fontSize: "0.75rem", color: "#999999", marginTop: "0.5rem" }}
        >
          Burning your NFTs is permanent and irreversible. The NFTs will be
          destroyed, and you will enter burn mode to earn bonus rewards.
        </p>
      </div>

      {selectedTokenIds.length > 0 && needsApproval && (
        <GeneralButton
          onClick={handleApprove}
          loading={isApproving || isApprovingConfirming || isPending || isConfirming}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {isApproving || isApprovingConfirming
            ? "Approving..."
            : isPending || isConfirming
            ? "Burning..."
            : `Approve & Burn ${selectedTokenIds.length} NFT${selectedTokenIds.length > 1 ? 's' : ''}`}
        </GeneralButton>
      )}

      {selectedTokenIds.length > 0 && !needsApproval && (
        <GeneralButton
          onClick={() => batchBurn(selectedTokenIds)}
          loading={isPending || isConfirming}
          style={{
            width: "100%",
            marginTop: "1rem",
            background: "#FF494A",
          }}
        >
          {isPending || isConfirming
            ? currentBatch > 0
              ? `Burning NFT ${currentBatch}/${totalBatches}...`
              : "Preparing..."
            : `Burn ${selectedTokenIds.length} NFT${selectedTokenIds.length > 1 ? 's' : ''}`}
        </GeneralButton>
      )}
    </div>
  );
}
