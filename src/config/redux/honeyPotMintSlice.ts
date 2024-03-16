import { createSlice } from "@reduxjs/toolkit";

interface HoneyPotMintState {
  currentPrice: string;
  nextPrice: string;
  mintedAmount: string;
  maxAmount: string;
  totalVIPNFTCount: string;
  mintedVIPNFTsCount: string;
}

const initialState = {
  currentPrice: "loading...",
  nextPrice: "loading...",
  mintedAmount: "loading...",
  maxAmount: "loading...",
  totalVIPNFTCount: "loading...",
  mintedVIPNFTsCount: "loading...",
} as HoneyPotMintState;

const honeyPotMintSlice = createSlice({
  name: "honeyPotMint",
  initialState,
  reducers: {
    setCurrentPrice: (state, action) => {
      state.currentPrice = action.payload;
    },
    setNextPrice: (state, action) => {
      state.nextPrice = action.payload;
    },
    setMintedAmount: (state, action) => {
      state.mintedAmount = action.payload;
    },
    setMaxAmount: (state, action) => {
      state.maxAmount = action.payload;
    },
    setTotalVIPNFTCount: (state, action) => {
      state.totalVIPNFTCount = action.payload;
    },
    setMintedVIPNFTsCount: (state, action) => {
      state.mintedVIPNFTsCount = action.payload;
    },
  },
});

export const selectPopUp = (state) => state.popUp;

export default honeyPotMintSlice.reducer;

export const {
  setCurrentPrice,
  setNextPrice,
  setMintedAmount,
  setMaxAmount,
  setTotalVIPNFTCount,
  setMintedVIPNFTsCount,
} = honeyPotMintSlice.actions;
