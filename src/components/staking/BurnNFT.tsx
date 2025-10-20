import { useState, useEffect, useRef } from "react";
import { useBurn, useStakingParams } from "@/hooks/useNFTStaking";
import { useSetApprovalForAll, useIsApproved } from "@/hooks/useNFT";
import { formatBps } from "@/lib/stakingUtils";
import { NFTSelector, NFTSelectorRef } from "./NFTSelector";
import GeneralButton from "../atoms/GeneralButton/GeneralButton";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";
import { useUserNFTs } from "@/hooks/useUserNFTs";

export function BurnNFT() {
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | undefined>();
  const burnableNFTSelectorRef = useRef<NFTSelectorRef>(null);
  const { burn, isPending, isConfirming, isSuccess, hash, error } = useBurn();
  const {
    setApprovalForAll,
    isPending: isApproving,
    isConfirming: isApprovingConfirming,
    isSuccess: isApproveSuccess,
    hash: approveHash,
  } = useSetApprovalForAll();
  const { isApprovedForAll } = useIsApproved(selectedTokenId);
  const { burnBonusBps } = useStakingParams();
  const { nfts } = useUserNFTs("all-burnable");
  const dispatch = useAppDispatch();

  const getExplorerUrl = (txHash: string) => {
    return `https://berascan.com/tx/${txHash}`;
  };

  // Check if the selected NFT is staked
  const selectedNFT = nfts.find(
    (nft) => nft.tokenId === selectedTokenId?.toString()
  );
  const isSelectedNFTStaked = selectedNFT?.isStaked || false;
  const needsApproval = !isSelectedNFTStaked && !isApprovedForAll;

  useEffect(() => {
    if (isSuccess && hash) {
      dispatch(
        openPopUp({
          title: "Burn Success",
          message: `NFT burned successfully! You are now earning bonus rewards!\n\nTransaction: ${hash.slice(
            0,
            10
          )}...${hash.slice(-8)}`,
          info: "success",
          link: getExplorerUrl(hash),
          linkText: "View on Explorer",
        })
      );

      // Poll for subgraph updates with exponential backoff
      const refetchWithRetry = async (attempts = 0, maxAttempts = 5) => {
        if (attempts >= maxAttempts) {
          console.log("Max refetch attempts reached");
          setSelectedTokenId(undefined);
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
      setSelectedTokenId(undefined);
    }
  }, [isSuccess, hash, dispatch]);

  useEffect(() => {
    if (isApproveSuccess && approveHash && selectedTokenId && !isPending && !isConfirming) {
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

      // Automatically trigger burn after approval
      burn(selectedTokenId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproveSuccess, approveHash, selectedTokenId, dispatch]);

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
        onSelect={setSelectedTokenId}
        selectedTokenId={selectedTokenId}
        mode="all-burnable"
        title="Select NFT to Burn"
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
          Burning your NFT is permanent and irreversible. The NFT will be
          destroyed, and you will enter burn mode to earn bonus rewards.
        </p>
      </div>

      {needsApproval && selectedTokenId !== undefined && (
        <GeneralButton
          onClick={handleApprove}
          loading={isApproving || isApprovingConfirming || isPending || isConfirming}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {isApproving || isApprovingConfirming
            ? "Approving..."
            : isPending || isConfirming
            ? "Burning..."
            : "Approve & Burn NFT"}
        </GeneralButton>
      )}

      {selectedTokenId !== undefined && isSelectedNFTStaked && (
        <GeneralButton
          onClick={() => burn(selectedTokenId)}
          loading={isPending || isConfirming}
          style={{
            width: "100%",
            marginTop: "1rem",
            background: "#FF494A",
          }}
        >
          {isPending || isConfirming ? "Burning..." : "Burn NFT"}
        </GeneralButton>
      )}
    </div>
  );
}
