import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import VipMint from "@/Routes/VipMint";
import WhiteListCheck from "./Routes/WhiteListCheck";
import MyAssets from "./Routes/MyAssets";
import Mint from "./Routes/Mint";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/mint",
    element: <Mint />,
  },
  {
    path: "/vip-mint",
    element: <VipMint />,
  },
  {
    path: "/my-assets",
    element: <MyAssets />,
  },
  {
    path: "/whitelist-check",
    element: <WhiteListCheck />,
  },
]);

export { router };
