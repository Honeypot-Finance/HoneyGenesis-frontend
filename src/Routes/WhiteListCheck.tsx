import { useState } from "react";
import Header from "@/components/Header";
import Game from "@/components/Game";
import bgImage from "@/assets/forest-bg.png";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";
import GeneralInput from "@/components/atoms/GeneralInput/GeneralInput";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";

interface subText {
  text: string;
  info: string;
}

export default function WhiteListCheck() {
  const [adressToCheck, setAdressToCheck] = useState("0x");
  const [subText, setSubText] = useState<subText>(null);

  const mockWhiteList = ["0x988D8FE9F7F53946c6f7f5204F7B71a1215685B8"];
  const mockMintChance = 5;

  const dispatch = useAppDispatch();
  const checkAddress = () => {
    if (mockWhiteList.includes(adressToCheck)) {
      setSubText({
        text: `🎉 Congradulations! 🎉 you have total ${mockMintChance} minting chances in priority mint!`,
        info: "success",
      });
      dispatch(
        openPopUp({
          title: "🎉 Congradulations! 🎉",
          message: `you have total ${mockMintChance} minting chances in priority mint!`,
          info: "success",
        })
      );
    } else {
      setSubText({
        text: "You are not on the white list, contact us if you think this is a mistake.",
        info: "error",
      });
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="main white-list-page">
        <img src={bgImage} alt="" className="bg-img" />

        <h1 className="title">🍯 Check Eligibility 🍯</h1>

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
          {subText && <p className={subText.info}>{subText.text}</p>}
        </div>
      </main>
      <Game className="mini-game" />
    </div>
  );
}
