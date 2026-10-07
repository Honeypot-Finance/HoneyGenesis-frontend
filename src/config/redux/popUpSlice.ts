import { createSlice } from "@reduxjs/toolkit";
interface PopUpState {
  isOpen: boolean;
  title: string;
  message: string;
  info: "normal" | "error" | "success" | "warning" | "pending";
  link?: string;
  linkText?: string;
}

const initialState = {
  isOpen: false,
  title: "",
  message: "",
  info: "normal",
  link: undefined,
  linkText: undefined,
} as PopUpState;

const popUpSlice = createSlice({
  name: "popUp",
  initialState,
  reducers: {
    openPopUp: (state, action) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.info = action.payload.info;
      state.link = action.payload.link;
      state.linkText = action.payload.linkText;
    },
    closePopUp: (state) => {
      state.isOpen = false;
      state.title = "";
      state.message = "";
      state.info = "normal";
      state.link = undefined;
      state.linkText = undefined;
    },
  },
});

export const selectPopUp = (state) => state.popUp;

export default popUpSlice.reducer;

export const { openPopUp, closePopUp } = popUpSlice.actions;
