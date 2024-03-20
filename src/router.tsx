import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import VipMint from "@/Routes/VipMint";
import WhiteListCheck from "./Routes/WhiteListCheck";
import MyAssets from "./Routes/MyAssets";
import Mint from "./Routes/Mint";
import ErrorPage from "./Routes/ErrorPage/ErrorPage";
import Terms from "./Routes/Terms";

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
      {
        path: "/terms",
        element: <Terms />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

export { router };
