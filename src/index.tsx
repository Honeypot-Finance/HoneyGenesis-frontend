import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import HoneyDropEffect from "./components/effect/HoneyDropEffect";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./config/redux/store";
import WalletConnectContextProvider from "@/components/walletConnect/WalletConnectContextProvider";
import { router } from "@/router";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <WalletConnectContextProvider>
        <RouterProvider router={router} />
        <HoneyDropEffect />
      </WalletConnectContextProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
