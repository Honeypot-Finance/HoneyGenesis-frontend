import { useState } from "react";
import Header from "@/components/Header";
import Game from "@/components/Game";
import bgImage from "@/assets/forest-bg.png";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";
import GeneralInput from "@/components/atoms/GeneralInput/GeneralInput";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";
import Container from "@/components/atoms/Container/Container";

//data
import whitelistData from "@/data/mintAmount.json";

interface subText {
  text: string;
  info: string;
}

export default function WhiteListCheck() {
  const [adressToCheck, setAdressToCheck] = useState("0x");
  const [subText, setSubText] = useState<subText>(null);

  const whitelistPartners = [
    "Nobody",
    "DoubleTop",
    "BOINK",
    "BONK",
    "Beraland",
    "Beramonium",
    "Beradrome",
    "Kingdomly",
    "gumball protocol",
    "THC",
  ];

  const dispatch = useAppDispatch();
  const checkAddress = () => {
    if (whitelistData[adressToCheck] !== undefined) {
      setSubText({
        text: `🎉 Congradulations! 🎉 you have total ${whitelistData[adressToCheck]} minting chances in priority mint!`,
        info: "success",
      });
      dispatch(
        openPopUp({
          title: "🎉 Congradulations! 🎉",
          message: `you have total ${whitelistData[adressToCheck]} minting chances in priority mint!`,
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
          <h2 className="partner-with">Partnered with:</h2>
          <Container>
            {whitelistPartners.map((partner, index) => {
              return <Container key={index}>{partner}</Container>;
            })}
          </Container>
        </div>
      </main>
      <Game className="mini-game" />
    </div>
  );
}
