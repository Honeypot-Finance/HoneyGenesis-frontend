import MainContentWrapper from "@/components/template/MainContentWrapper/MainContentWrapper";
import GeneralDropDown from "@/components/atoms/GeneralDropDown/GeneralDropDown";
import NFT_PARTS from "@/assets/nft";

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
  const layer0Options = [];
  const layer1Options = [];
  const layer2Options = [];
  const layer3Options = [];
  const layer4Options = [];
  const layer5Options = [];
  const layer6Options = [];
  const layers = {
    0: {
      value: layer0,
      setValue: setLayer0,
      options: layer0Options,
    },
    1: {
      value: layer1,
      setValue: setLayer1,
      options: layer1Options,
    },
    2: {
      value: layer2,
      setValue: setLayer2,
      options: layer2Options,
    },
    3: {
      value: layer3,
      setValue: setLayer3,
      options: layer3Options,
    },
    4: {
      value: layer4,
      setValue: setLayer4,
      options: layer4Options,
    },
    5: {
      value: layer5,
      setValue: setLayer5,
      options: layer5Options,
    },
    6: {
      value: layer6,
      setValue: setLayer6,
      options: layer6Options,
    },
  };

  for (const key in layers) {
    const layer = layers[key];
    for (let i = 0; i < NFT_PARTS[bearType][key].length; i++) {
      layer.options.push(i);
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
            <GeneralDropDown
              value={bearType}
              setValue={changeBearHandler}
              unitName="Bear"
              options={bearOptions}
            ></GeneralDropDown>

            {Object.values(layers).map((layer, index) => {
              return (
                <GeneralDropDown
                  value={layer.value}
                  setValue={layer.setValue}
                  unitName={"layer" + index.toString()}
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
