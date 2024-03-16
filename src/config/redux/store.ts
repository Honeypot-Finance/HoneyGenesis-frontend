import { configureStore } from "@reduxjs/toolkit";
import marioReducer from "./marioSlice";
import obstacleReducer from "./obstacleSlice";
import engineReducer from "./engineSlice";
import popUpReducer from "./popUpSlice";
import honeyPotMintReducer from "./honeyPotMintSlice";

export const store = configureStore({
  reducer: {
    //popUp
    popUp: popUpReducer,
    //game
    mario: marioReducer,
    obstacle: obstacleReducer,
    engine: engineReducer,
    honey: honeyPotMintReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
