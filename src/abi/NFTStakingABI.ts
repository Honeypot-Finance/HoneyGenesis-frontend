export const NFTStakingABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "UPGRADE_INTERFACE_VERSION",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "aggregate3",
    inputs: [
      {
        name: "calls",
        type: "tuple[]",
        internalType: "struct NFTStaking.Call3[]",
        components: [
          {
            name: "target",
            type: "address",
            internalType: "address",
          },
          {
            name: "allowFailure",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "callData",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "returnData",
        type: "tuple[]",
        internalType: "struct NFTStaking.Result[]",
        components: [
          {
            name: "success",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "returnData",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "aggregate3Value",
    inputs: [
      {
        name: "calls",
        type: "tuple[]",
        internalType: "struct NFTStaking.Call3Value[]",
        components: [
          {
            name: "target",
            type: "address",
            internalType: "address",
          },
          {
            name: "allowFailure",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "value",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "callData",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "returnData",
        type: "tuple[]",
        internalType: "struct NFTStaking.Result[]",
        components: [
          {
            name: "success",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "returnData",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "batchBurn",
    inputs: [
      {
        name: "tokenIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "recipient",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "batchClaim",
    inputs: [
      {
        name: "tokenIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "batchStake",
    inputs: [
      {
        name: "tokenIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "recipient",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "batchUnstake",
    inputs: [
      {
        name: "tokenIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "tokenReceiver",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "burn",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "burnBonusBps",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "claim",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      {
        name: "_nft",
        type: "address",
        internalType: "contract IERC721",
      },
      {
        name: "_rewards",
        type: "address",
        internalType: "contract RewardsToken",
      },
      {
        name: "_ratePerSecond",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_burnBonusBps",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "initialOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "multicall",
    inputs: [
      {
        name: "data",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    outputs: [
      {
        name: "results",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "nft",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC721",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "onERC721Received",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "payoutRecipient",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "previewPayout",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proxiableUUID",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "rewardRatePerSecond",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "rewards",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract RewardsToken",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setParameters",
    inputs: [
      {
        name: "_ratePerSecond",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_burnBonusBps",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setPayoutRecipient",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "recipient",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "stake",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "stakes",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
      {
        name: "stakedAt",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "lastClaimAt",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "burned",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "burnedAt",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "lastBurnClaimAt",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unstake",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "upgradeToAndCall",
    inputs: [
      {
        name: "newImplementation",
        type: "address",
        internalType: "address",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "version",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "event",
    name: "BatchBurned",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenIds",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "recipient",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BatchClaimed",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenIds",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BatchStaked",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenIds",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BatchUnstaked",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenIds",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
      {
        name: "tokenReceiver",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BurnRewardClaimed",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Burned",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MultiCallExecuted",
    inputs: [
      {
        name: "caller",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "callsCount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ParametersUpdated",
    inputs: [
      {
        name: "rewardRatePerSecond",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "burnBonusBps",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PayoutRecipientSet",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RewardClaimed",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Staked",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StakedFor",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Unstaked",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "UnstakedFor",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "operator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Upgraded",
    inputs: [
      {
        name: "implementation",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AddressEmptyCode",
    inputs: [
      {
        name: "target",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ERC1967InvalidImplementation",
    inputs: [
      {
        name: "implementation",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ERC1967NonPayable",
    inputs: [],
  },
  {
    type: "error",
    name: "FailedCall",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidInitialization",
    inputs: [],
  },
  {
    type: "error",
    name: "NotInitializing",
    inputs: [],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ReentrancyGuardReentrantCall",
    inputs: [],
  },
  {
    type: "error",
    name: "UUPSUnauthorizedCallContext",
    inputs: [],
  },
  {
    type: "error",
    name: "UUPSUnsupportedProxiableUUID",
    inputs: [
      {
        name: "slot",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
] as const;
