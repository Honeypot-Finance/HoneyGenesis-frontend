import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import VipMint from "@/Routes/VipMint";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/vip-mint",
    element: <VipMint />,
  },
]);

export { router };
