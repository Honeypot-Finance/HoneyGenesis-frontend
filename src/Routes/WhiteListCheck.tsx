import { ReactNode, useCallback, useState } from "react";
import Header from "@/components/Header";
import Game from "@/components/Game";
import bgImage from "@/assets/forest-bg.png";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";
import GeneralInput from "@/components/atoms/GeneralInput/GeneralInput";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { openPopUp } from "@/config/redux/popUpSlice";
import Container from "@/components/atoms/Container/Container";
import HorizontalScroll from "@/components/molecules/HorizontalScroll/HorizontalScroll";

//data
import whitelistData from "@/data/mintAmount.json";

interface subText {
  text: string | ReactNode;
  info: string;
}

export default function WhiteListCheck() {
  const [adressToCheck, setAdressToCheck] = useState("0x");
  const [subText, setSubText] = useState<subText>(null);

  const whitelistPartners = Object.keys(whitelistData);

  const hasMintAmount = useCallback(
    (address: string) => {
      let output = false;

      whitelistPartners.forEach((partner) => {
        const findAddress = Object.entries(whitelistData[partner]).find(
          ([key]) => {
            if (key.trim().toLowerCase() == address.trim().toLowerCase()) {
              return true;
            }
          }
        );
        if (findAddress != undefined) {
          output = true;
          return true;
        }
      });

      return output;
    },
    [whitelistPartners]
  );

  const getMintAmountText = useCallback(
    (address: string) => {
      let output = "\n";

      whitelistPartners.forEach((partner) => {
        Object.keys(whitelistData[partner]).forEach((key) => {
          console.log(key);
          if (key.trim().toLowerCase() == address.trim().toLowerCase()) {
            output += `${whitelistData[partner][key]} minting chance from ${partner}\n`;
          }
        });
      });

      return output;
    },
    [whitelistPartners]
  );

  const dispatch = useAppDispatch();

  const checkAddress = useCallback(() => {
    if (hasMintAmount(adressToCheck)) {
      console.log(hasMintAmount(adressToCheck));
      setSubText({
        text: `🎉 Congratulations! 🎉 you have ${getMintAmountText(
          adressToCheck
        )} in priority mint!`,
        info: "success",
      });
      dispatch(
        openPopUp({
          title: "🎉 Congratulations! 🎉",
          message: `you have ${getMintAmountText(
            adressToCheck
          )} in priority mint!`,
          info: "success",
        })
      );
    } else {
      console.log(hasMintAmount(adressToCheck));
      setSubText({
        text: "Oops! you are not in the priority mint list. Some tickets may still in progress, please check again later.",
        info: "white-trans",
      });
    }
  }, [hasMintAmount, adressToCheck, getMintAmountText, dispatch]);

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
          <pre>{subText && <p className={subText.info}>{subText.text}</p>}</pre>
          <h2 className="partner-with">Get Priority Mints from:</h2>
          <HorizontalScroll
            items={whitelistPartners.map((partner) => {
              return {
                content: (
                  <Container oneline key={partner}>
                    {partner}
                  </Container>
                ),
              };
            })}
            speed={10000}
            stopOnHover
          />
          {/* <Container>
            {whitelistPartners.map((partner, index) => {
              return <Container key={index}>{partner}</Container>;
            })}
          </Container> */}
        </div>
      </main>
      <Game className="mini-game" />
    </div>
  );
}
