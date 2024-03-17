import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import VipMint from "@/Routes/VipMint";
import WhiteListCheck from "./Routes/WhiteListCheck";
import MyAssets from "./Routes/MyAssets";
import Mint from "./Routes/Mint";
import ErrorPage from "./Routes/ErrorPage/ErrorPage";

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
    ],
    errorElement: <ErrorPage />,
  },
]);

export { router };
