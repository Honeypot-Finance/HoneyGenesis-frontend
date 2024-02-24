import React from "react";
import { useReadContract } from "wagmi";
import HoneyGenesis from "@/abi/HoneyGenesis.json"

const contractAddress = "0xd1633D9C0308f697151C88e231647C1E5248FB1F";
const chainId = 421614;

function useReadGenesisContract(functionName) {
  const res = useReadContract({
    abi: HoneyGenesis.abi,
    chainId: chainId,
    functionName: functionName,
    address: contractAddress,
  });

  return res.isPending ? <span>Loading...</span> : <span>{res.data}</span>;
}


function CurrentPrice() {
  return useReadGenesisContract("getCurrentPrice");
}

function MintedAmount() {
  return useReadGenesisContract("getMintedNFTsCount");
} 

function TotalSupply() {
  return 5000000;
}

function NextNFTPrice() {
  return useReadGenesisContract("getNextNFTPrice");
}

export {CurrentPrice, MintedAmount, TotalSupply, NextNFTPrice}