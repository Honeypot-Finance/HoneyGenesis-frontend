import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useBatchStake } from "@/hooks/useNFTStaking";
import { useSetApprovalForAll, useIsApproved } from "@/hooks/useNFT";
import { NFTSelector, NFTSelectorRef } from "./NFTSelector";
import GeneralButtonClean from "../atoms/GeneralButtonClean/GeneralButtonClean";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";

export interface StakeNFTRef {
  refetchWalletNFTs: () => Promise<void>;
}

interface StakeNFTProps {
  onSuccess?: () => void;
}

export const StakeNFT = forwardRef<StakeNFTRef, StakeNFTProps>(({ onSuccess }, ref) => {
  const [selectedTokenIds, setSelectedTokenIds] = useState<bigint[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const walletNFTSelectorRef = useRef<NFTSelectorRef>(null);
  const {
    batchStake,
    isPending: isStaking,
    isConfirming,
    isSuccess,
    hash: stakeHash,
    allHashes,
    currentBatch,
    totalBatches,
    error: stakeError,
  } = useBatchStake();
  const {
    setApprovalForAll,
    isPending: isApproving,
    isConfirming: isApprovingConfirming,
    isSuccess: isApproveSuccess,
    hash: approveHash,
  } = useSetApprovalForAll();
  // Check approval status - isApprovedForAll applies to ALL NFTs, so we can check with any tokenId
  const { isApprovedForAll, refetch: refetchApproval } = useIsApproved(selectedTokenIds[0]);
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
    if (isSuccess && allHashes && allHashes.length > 0) {
      const hashesText = allHashes.length === 1
        ? `Transaction: ${allHashes[0].slice(0, 10)}...${allHashes[0].slice(-8)}`
        : `${allHashes.length} transactions completed\nLast: ${allHashes[allHashes.length - 1].slice(0, 10)}...${allHashes[allHashes.length - 1].slice(-8)}`;

      dispatch(
        openPopUp({
          title: "Stake Success",
          message: `${allHashes.length} NFT${allHashes.length > 1 ? 's' : ''} staked successfully!\n\n${hashesText}`,
          info: "success",
          link: getExplorerUrl(allHashes[allHashes.length - 1]),
          linkText: "View Last Transaction",
        })
      );

      // Poll for subgraph updates with exponential backoff
      const refetchWithRetry = async (attempts = 0, maxAttempts = 5) => {
        if (attempts >= maxAttempts) {
          console.log('Max refetch attempts reached');
          setSelectedTokenIds([]);
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
      setSelectedTokenIds([]);

      // Call the success callback
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isSuccess, allHashes, dispatch, onSuccess]);

  // Handle stake errors
  useEffect(() => {
    if (stakeError) {
      console.error('Batch stake error:', stakeError);
      dispatch(
        openPopUp({
          title: "Stake Failed",
          message: `Failed to stake NFTs.\n\nError: ${stakeError.message || 'Unknown error'}\n\nPlease check:\n- NFTs are in your wallet\n- You have approved the staking contract\n- NFTs are not already staked`,
          info: "error",
        })
      );
    }
  }, [stakeError, dispatch]);

  useEffect(() => {
    if (isApproveSuccess && approveHash) {
      dispatch(
        openPopUp({
          title: "Approval Success",
          message: `All NFTs approved successfully! You can now click the "Stake" button to stake your NFTs.\n\nTransaction: ${approveHash.slice(
            0,
            10
          )}...${approveHash.slice(-8)}`,
          info: "success",
          link: getExplorerUrl(approveHash),
          linkText: "View on Explorer",
        })
      );

      // Refetch approval status
      setTimeout(() => {
        refetchApproval();
      }, 2000);
    }
  }, [isApproveSuccess, approveHash, dispatch, refetchApproval]);

  const handleApprove = () => {
    console.log('=== APPROVAL DEBUG ===');
    console.log('Calling setApprovalForAll(true) for ALL NFTs');
    console.log('This will approve the staking contract to transfer any of your NFTs');
    console.log('Selected token IDs:', selectedTokenIds);
    console.log('Current isApprovedForAll status:', isApprovedForAll);
    console.log('=== END DEBUG ===');
    setApprovalForAll(true);
  };

  const handleStake = async () => {
    if (selectedTokenIds.length === 0) return;

    console.log('=== BATCH STAKE DEBUG ===');
    console.log('Manual stake triggered for tokens:', selectedTokenIds);
    console.log('Approval status (isApprovedForAll):', isApprovedForAll);
    console.log('Number of NFTs selected:', selectedTokenIds.length);

    // Verify NFTs are in wallet
    const currentNFTs = walletNFTSelectorRef.current;
    console.log('Current wallet NFTs selector ref:', currentNFTs);
    console.log('=== END DEBUG ===');

    if (!isApprovedForAll) {
      console.error('ERROR: Attempting to stake without setApprovalForAll! This should not happen.');
      dispatch(
        openPopUp({
          title: "Approval Required",
          message: "Please approve the staking contract first using 'Approve All & Stake' button.",
          info: "warning",
        })
      );
      return;
    }

    batchStake(selectedTokenIds, recipientAddress || undefined);
  };

  return (
    <div>
      <NFTSelector
        ref={walletNFTSelectorRef}
        onSelect={() => {}} // Not used in multi-select mode
        onMultiSelect={setSelectedTokenIds}
        selectedTokenIds={selectedTokenIds}
        multiSelect={true}
        mode="wallet"
        title="Select NFTs to Stake"
      />

      {/* Advanced Options - Collapsed */}
      {selectedTokenIds.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              background: "transparent",
              border: "none",
              color: "#F7A129",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              padding: "0.5rem 0",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ transform: showAdvanced ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
              ▶
            </span>
            Advanced Options
          </button>

          {showAdvanced && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "rgba(247, 161, 41, 0.1)",
                border: "2px solid rgba(247, 161, 41, 0.3)",
                borderRadius: "12px",
              }}
            >
              <label
                style={{
                  display: "block",
                  color: "#C4B5A0",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                Rewards Recipient Address (Optional)
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x... (leave empty to receive rewards yourself)"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "2px solid #5A4530",
                  background: "#3A2810",
                  color: "white",
                  fontSize: "0.9rem",
                  boxSizing: "border-box",
                }}
              />
              <p
                style={{
                  color: "#A08B6F",
                  fontSize: "0.8rem",
                  margin: "0.5rem 0 0 0",
                  lineHeight: "1.5",
                }}
              >
                Specify a different address to receive staking rewards. If left empty, you will receive the rewards.
                This is useful for staking NFTs on behalf of others.
              </p>
            </div>
          )}
        </div>
      )}

      {selectedTokenIds.length > 0 && !isApprovedForAll && (
        <GeneralButtonClean
          onClick={handleApprove}
          loading={isApproving || isApprovingConfirming || isStaking || isConfirming}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {isApproving || isApprovingConfirming
            ? "Approving..."
            : isStaking || isConfirming
            ? "Staking..."
            : `Approve All & Stake ${selectedTokenIds.length} NFT${selectedTokenIds.length > 1 ? 's' : ''}`}
        </GeneralButtonClean>
      )}

      {selectedTokenIds.length > 0 && isApprovedForAll && (
        <GeneralButtonClean
          onClick={handleStake}
          loading={isStaking || isConfirming}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {isStaking || isConfirming
            ? currentBatch > 0
              ? `Staking Batch ${currentBatch}/${totalBatches}...`
              : "Preparing..."
            : `Stake ${selectedTokenIds.length} NFT${selectedTokenIds.length > 1 ? 's' : ''}`}
        </GeneralButtonClean>
      )}
    </div>
  );
});
