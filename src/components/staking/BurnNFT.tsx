import { useState, useEffect } from "react";
import { useBurn, useStakingParams } from "@/hooks/useNFTStaking";
import { useSetApprovalForAll, useIsApproved } from "@/hooks/useNFT";
import { formatBps } from "@/lib/stakingUtils";
import { NFTSelector } from "./NFTSelector";
import GeneralButton from "../atoms/GeneralButton/GeneralButton";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";
import { useUserNFTs } from "@/hooks/useUserNFTs";

export function BurnNFT() {
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | undefined>();
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const { burn, isPending, isConfirming, isSuccess, hash } = useBurn();
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
    return `https://testnet.berascan.com/tx/${txHash}`;
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
      const timer = setTimeout(() => {
        setRefetchTrigger((prev) => prev + 1);
        setSelectedTokenId(undefined);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, hash, dispatch]);

  useEffect(() => {
    if (isApproveSuccess && approveHash) {
      dispatch(
        openPopUp({
          title: "Approval Success",
          message: `All NFTs approved successfully! You can now burn unstaked NFTs.\n\nTransaction: ${approveHash.slice(
            0,
            10
          )}...${approveHash.slice(-8)}`,
          info: "success",
          link: getExplorerUrl(approveHash),
          linkText: "View on Explorer",
        })
      );
      const timer = setTimeout(() => {
        setRefetchTrigger((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isApproveSuccess, approveHash, dispatch]);

  const handleApprove = () => {
    setApprovalForAll(true);
  };

  const handleBurn = () => {
    if (selectedTokenId === undefined) return;
    if (
      !window.confirm(
        "Are you sure you want to burn this NFT? This action cannot be undone!"
      )
    ) {
      return;
    }
    burn(selectedTokenId);
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
            Current burn bonus:{" "}
            <span style={{ fontSize: "1.2rem" }}>
              {formatBps(burnBonusBps)}
            </span>
          </p>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#999999",
              marginTop: "0.5rem",
            }}
          >
            Burning increases your rewards by this percentage
          </p>
        </div>
      )}

      <NFTSelector
        onSelect={setSelectedTokenId}
        selectedTokenId={selectedTokenId}
        mode="all-burnable"
        title="Select NFT to Burn"
        key={refetchTrigger}
      />

      {needsApproval && selectedTokenId !== undefined && (
        <GeneralButton
          onClick={handleApprove}
          loading={isApproving || isApprovingConfirming}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {isApproving || isApprovingConfirming
            ? "Approving..."
            : "Approve NFTs for Burning"}
        </GeneralButton>
      )}

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

      {selectedTokenId !== undefined &&
        (isSelectedNFTStaked || isApprovedForAll) && (
          <GeneralButton
            onClick={handleBurn}
            loading={isPending || isConfirming}
            style={{
              width: "100%",
              marginTop: "1rem",
              background: isPending || isConfirming ? "#666666" : "#FF494A",
            }}
          >
            {isPending || isConfirming ? "Burning..." : "Burn NFT"}
          </GeneralButton>
        )}
    </div>
  );
}
