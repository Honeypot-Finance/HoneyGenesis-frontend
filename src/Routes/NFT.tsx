import MainContentWrapper from "@/components/template/MainContentWrapper/MainContentWrapper";
import GeneralDropDown from "@/components/atoms/GeneralDropDown/GeneralDropDown";
import NFT_PARTS from "@/assets/nft";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";

//imgs
import bgImage from "@/assets/forest-bg.png";
import { useState } from "react";

export default function NFT() {
  const [bearType, setBearType] = useState("pot");
  const [layer0, setLayer0] = useState("0");
  const [layer1, setLayer1] = useState("0");
  const [layer2, setLayer2] = useState("0");
  const [layer3, setLayer3] = useState("0");
  const [layer4, setLayer4] = useState("0");
  const [layer5, setLayer5] = useState("0");
  const [layer6, setLayer6] = useState("0");

  const bearOptions = ["pot", "predator"];
  const layers = {
    0: {
      name: "background",
      value: layer0,
      setValue: setLayer0,
      options: [],
    },
    1: {
      name: "bear",
      value: layer1,
      setValue: setLayer1,
      options: [],
    },
    2: {
      name: "t-shirt",
      value: layer2,
      setValue: setLayer2,
      options: [],
    },
    3: {
      name: "hat",
      value: layer3,
      setValue: setLayer3,
      options: [],
    },
    4: {
      name: "glasses",
      value: layer4,
      setValue: setLayer4,
      options: [],
    },
    5: {
      name: "smoke",
      value: layer5,
      setValue: setLayer5,
      options: [],
    },
    6: {
      name: "weapon",
      value: layer6,
      setValue: setLayer6,
      options: [],
    },
  };

  refreshLayerOptions();

  function refreshLayerOptions(bear: string = bearType) {
    for (const key in layers) {
      const layer = layers[key];
      layer.options = [];
      for (let i = 0; i < NFT_PARTS[bear][key].length; i++) {
        layer.options.push(i);
      }
    }
  }

  function changeBearHandler(value: string) {
    setBearType(value);
    setLayer0("0");
    setLayer1("0");
    setLayer2("0");
    setLayer3("0");
    setLayer4("0");
    setLayer5("0");
    setLayer6("0");
  }

  function randomNFTHandler() {
    const newBearType =
      bearOptions[Math.floor(Math.random() * bearOptions.length)];
    setBearType(newBearType);
    refreshLayerOptions(newBearType);

    const newLayer0 = Math.floor(
      Math.random() * layers[0].options.length
    ).toString();
    const newLayer1 = Math.floor(
      Math.random() * layers[1].options.length
    ).toString();
    const newLayer2 = Math.floor(
      Math.random() * layers[2].options.length
    ).toString();
    const newLayer3 = Math.floor(
      Math.random() * layers[3].options.length
    ).toString();
    const newLayer4 = Math.floor(
      Math.random() * layers[4].options.length
    ).toString();
    const newLayer5 = Math.floor(
      Math.random() * layers[5].options.length
    ).toString();
    const newLayer6 = Math.floor(
      Math.random() * layers[6].options.length
    ).toString();

    setLayer0(newLayer0);
    setLayer1(newLayer1);
    setLayer2(newLayer2);
    setLayer3(newLayer3);
    setLayer4(newLayer4);
    setLayer5(newLayer5);
    setLayer6(newLayer6);
  }

  return (
    <div className="App nft">
      <MainContentWrapper lock={false}>
        <div className="nft-section">
          <div className="right-section">
            <div className="nft-img-container">
              {Object.values(layers).map((layer, index) => {
                return (
                  <img
                    className="nft-img"
                    src={NFT_PARTS[bearType][index][layer.value]}
                    alt=""
                  />
                );
              })}
            </div>
          </div>
          <main className="main nft">
            <img src={bgImage} alt="" className="bg-img" />
            <h1 className="title">Choose Your NFT</h1>
            <GeneralButton onClick={() => randomNFTHandler()}>
              Random
            </GeneralButton>
            <GeneralDropDown
              value={bearType}
              setValue={changeBearHandler}
              unitName="Bear"
              options={bearOptions}
            ></GeneralDropDown>

            {Object.values(layers).map((layer, index) => {
              return (
                <GeneralDropDown
                  key={index}
                  value={layer.value}
                  setValue={layer.setValue}
                  unitName={layer.name}
                  options={layer.options}
                ></GeneralDropDown>
              );
            })}
          </main>
        </div>
      </MainContentWrapper>
    </div>
  );
}
