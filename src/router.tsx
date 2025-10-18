import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import VipMint from "@/Routes/VipMint";
import WhiteListCheck from "./Routes/WhiteListCheck";
import MyAssets from "./Routes/MyAssets";
import Mint from "./Routes/Mint";
import ErrorPage from "./Routes/ErrorPage/ErrorPage";
import Terms from "./Routes/Terms";
import NFT from "./Routes/NFT";
import Staking from "./Routes/Staking";
import StakingDynamic from "./Routes/StakingDynamic";

const router = createBrowserRouter([
  {
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/mint",
        element: <Mint />,
      },
      {
        path: "/v123i4p5-m1i2n3t4",
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
      {
        path: "/terms",
        element: <Terms />,
      },
      {
        path: "/reveal",
        element: <NFT />,
      },
      {
        path: "/staking",
        element: <Staking />,
      },
      {
        path: "/staking-dynamic",
        element: <StakingDynamic />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

export { router };
