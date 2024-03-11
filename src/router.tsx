import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import VipMint from "@/Routes/VipMint";
import WhiteListCheck from "./Routes/WhiteListCheck";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/vip-mint",
    element: <VipMint />,
  },
  {
    path: "/white-list-check",
    element: <WhiteListCheck />,
  },
]);

export { router };
