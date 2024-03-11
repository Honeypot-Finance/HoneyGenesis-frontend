import { useState } from "react";
import Header from "@/components/Header";
import Game from "@/components/Game";
import bgImage from "@/assets/forest-bg.png";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";
import GeneralInput from "@/components/atoms/GeneralInput/GeneralInput";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";

export default function WhiteListCheck() {
  const [adressToCheck, setAdressToCheck] = useState("0x");

  const mockWhiteList = ["0x988D8FE9F7F53946c6f7f5204F7B71a1215685B8"];
  const mockMintChance = 5;

  const dispatch = useAppDispatch();

  const checkAddress = () => {
    if (mockWhiteList.includes(adressToCheck)) {
      dispatch(
        openPopUp({
          title: "🎉 Congradulations! 🎉",
          message: `you have total ${mockMintChance} minting chances in priority mint!`,
          info: "success",
        })
      );
    } else {
      dispatch(
        openPopUp({
          title: "You are not on the white list!",
          message:
            "if you think this is a mistake, please contact us or your provider.",
          info: "error",
        })
      );
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="main white-list-page">
        <img src={bgImage} alt="" className="bg-img" />

        <h1 className="title">🍯 White List Check 🍯</h1>

        <div className="mint-form">
          <GeneralInput
            value={adressToCheck}
            setValue={setAdressToCheck}
            unitName="Address"
            style={{ margin: "1rem" }}
          />
          <GeneralButton
            containerStyle={{
              margin: "1rem",
            }}
            onClick={() => {
              checkAddress();
            }}
          >
            Check
          </GeneralButton>
        </div>
      </main>
      <Game className="mini-game" />
    </div>
  );
}
