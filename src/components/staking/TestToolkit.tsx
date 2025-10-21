import { useState, useEffect } from "react";
import { useSetApprovalForAll, useIsApproved } from "@/hooks/useNFT";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";
import GeneralButton from "../atoms/GeneralButton/GeneralButton";

export function TestToolkit() {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    setApprovalForAll,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  } = useSetApprovalForAll();
  const { isApprovedForAll, refetch } = useIsApproved(undefined);
  const dispatch = useAppDispatch();

  const getExplorerUrl = (hash: string) => {
    return `https://berascan.com/tx/${hash}`;
  };

  useEffect(() => {
    if (isSuccess && hash) {
      dispatch(
        openPopUp({
          title: "Revoke Success",
          message: `NFT approval revoked successfully!\n\nTransaction: ${hash.slice(
            0,
            10
          )}...${hash.slice(-8)}`,
          info: "success",
          link: getExplorerUrl(hash),
          linkText: "View on Explorer",
        })
      );
      // Refetch approval status
      refetch();
    }
  }, [isSuccess, hash, dispatch, refetch]);

  const handleRevokeApproval = () => {
    setApprovalForAll(false);
  };

  const handleGrantApproval = () => {
    setApprovalForAll(true);
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "#1a1a1a",
        borderBottom: "2px solid #ff6b6b",
        padding: "0.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: "bold",
              color: "#ff6b6b",
            }}
          >
            🛠 DEV TOOLKIT
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: "none",
              border: "1px solid #ff6b6b",
              color: "#ff6b6b",
              padding: "0.25rem 0.75rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.75rem",
            }}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            color: "#999",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>Approval Status:</span>
          <span
            style={{
              color: isApprovedForAll ? "#4ade80" : "#999",
              fontWeight: "bold",
            }}
          >
            {isApprovedForAll ? "Approved" : "Not Approved"}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div
          style={{
            maxWidth: "1200px",
            margin: "1rem auto 0",
            padding: "1rem",
            backgroundColor: "#2a2a2a",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "0.9rem",
                  color: "#ffcd4d",
                  marginBottom: "0.5rem",
                }}
              >
                NFT Approval Controls
              </h3>
              <p style={{ fontSize: "0.75rem", color: "#999", margin: 0 }}>
                Manage NFT contract approvals for testing purposes
              </p>
            </div>

            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                gap: "0.75rem",
              }}
            >
              <GeneralButton
                onClick={handleRevokeApproval}
                loading={isPending || isConfirming}
                disabled={!isApprovedForAll}
                style={{
                  fontSize: "0.85rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ef4444",
                  border: "2px solid #dc2626",
                }}
              >
                {isPending || isConfirming
                  ? "Revoking..."
                  : "Revoke Approval"}
              </GeneralButton>

              <GeneralButton
                onClick={handleGrantApproval}
                loading={isPending || isConfirming}
                disabled={isApprovedForAll}
                style={{
                  fontSize: "0.85rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#22c55e",
                  border: "2px solid #16a34a",
                }}
              >
                {isPending || isConfirming ? "Granting..." : "Grant Approval"}
              </GeneralButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
