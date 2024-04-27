import MainContentWrapper from "@/components/template/MainContentWrapper/MainContentWrapper";
import GeneralDropDown from "@/components/atoms/GeneralDropDown/GeneralDropDown";
import NFT_PARTS from "@/assets/nft";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";
import mergeImages from "merge-images";

//imgs
import bgImage from "@/assets/forest-bg.png";
import { useEffect, useState, useRef, useCallback } from "react";
import noneImg from "@/assets/nft/None.png";

export default function NFT() {
  const avatarImage = useRef<HTMLImageElement>(null);
  const [bearType, setBearType] = useState("pot");
  const nftContainer = useRef<HTMLDivElement>(null);
  const [layer0, setLayer0] = useState({ name: "none", img: noneImg });
  const [layer1, setLayer1] = useState({ name: "none", img: noneImg });
  const [layer2, setLayer2] = useState({ name: "none", img: noneImg });
  const [layer3, setLayer3] = useState({ name: "none", img: noneImg });
  const [layer4, setLayer4] = useState({ name: "none", img: noneImg });
  const [layer5, setLayer5] = useState({ name: "none", img: noneImg });
  const [layer6, setLayer6] = useState({ name: "none", img: noneImg });
  const [layer7, setLayer7] = useState({ name: "none", img: noneImg });
  const [layer8, setLayer8] = useState({ name: "none", img: noneImg });

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
      name: "nail",
      value: layer2,
      setValue: setLayer2,
      options: [],
    },
    3: {
      name: "emotion",
      value: layer3,
      setValue: setLayer3,
      options: [],
    },
    4: {
      name: "cloth",
      value: layer4,
      setValue: setLayer4,
      options: [],
    },
    5: {
      name: "hat",
      value: layer5,
      setValue: setLayer5,
      options: [],
    },
    6: {
      name: "glasses",
      value: layer6,
      setValue: setLayer6,
      options: [],
    },
    7: {
      name: "smoke",
      value: layer7,
      setValue: setLayer7,
      options: [],
    },
    8: {
      name: "handhold",
      value: layer8,
      setValue: setLayer8,
      options: [],
    },
  };

  const updateAvatarImage = useCallback(
    (download = false) => {
      function urltoFile(url, filename, mimeType) {
        mimeType = mimeType || (url.match(/^data:([^;]+);/) || "")[1];
        return fetch(url)
          .then(function (res) {
            return res.arrayBuffer();
          })
          .then(function (buf) {
            return new File([buf], filename, { type: mimeType });
          });
      }

      const xPadding = 30;
      const yPadding = 800;
      const imageSize = 3000;
      mergeImages(
        [
          { src: layer0.img, x: -xPadding, y: -yPadding },
          { src: layer1.img, x: -xPadding, y: -yPadding },
          { src: layer2.img, x: -xPadding, y: -yPadding },
          { src: layer3.img, x: -xPadding, y: -yPadding },
          { src: layer4.img, x: -xPadding, y: -yPadding },
          { src: layer5.img, x: -xPadding, y: -yPadding },
          { src: layer6.img, x: -xPadding, y: -yPadding },
          { src: layer7.img, x: -xPadding, y: -yPadding },
          { src: layer8.img, x: -xPadding, y: -yPadding },
        ],
        {
          width: imageSize,
          height: imageSize,
        }
      ).then((img) => {
        avatarImage.current.src = img;

        if (download) {
          urltoFile(img, "nft.png", "base64").then(function (file) {
            console.log(file);
            const url = URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = url;
            a.download = "nft.png";
            a.click();
            URL.revokeObjectURL(url);
          });
        }
      });
    },
    [
      layer0.img,
      layer1.img,
      layer2.img,
      layer3.img,
      layer4.img,
      layer5.img,
      layer6.img,
      layer7.img,
      layer8.img,
    ]
  );

  refreshLayerOptions();

  useEffect(() => {
    //preload images
    for (const key in layers) {
      const layer = layers[key];
      for (let i = 0; i < layer.options.length; i++) {
        preloadImage(layer.options[i].img);
      }
    }
    randomNFTHandler();
  }, []);

  useEffect(() => {
    updateAvatarImage();
  }, [
    bearType,
    layer0,
    layer1,
    layer2,
    layer3,
    layer4,
    layer5,
    layer6,
    layer7,
    layer8,
    updateAvatarImage,
  ]);

  function refreshLayerOptions(bear: string = bearType) {
    for (const key in layers) {
      const layer = layers[key];
      layer.options = [];
      for (let i = 0; i < NFT_PARTS[bear][key].length; i++) {
        layer.options.push(NFT_PARTS[bear][key][i]);
      }
    }
  }

  function changeBearHandler(value: string) {
    setBearType(value);
    refreshLayerOptions(value);
    setLayer0(layers[0].options[0]);
    setLayer1(layers[1].options[0]);
    setLayer2(layers[2].options[0]);
    setLayer3(layers[3].options[0]);
    setLayer4(layers[4].options[0]);
    setLayer5(layers[5].options[0]);
    setLayer6(layers[6].options[0]);
    setLayer7(layers[7].options[0]);
    setLayer8(layers[8].options[0]);
  }

  function randomNFTHandler() {
    const newBearType =
      bearOptions[Math.floor(Math.random() * bearOptions.length)];
    setBearType(newBearType);
    refreshLayerOptions(newBearType);

    const newLayer0 =
      layers[0].options[Math.floor(Math.random() * layers[0].options.length)];
    const newLayer1 =
      layers[1].options[Math.floor(Math.random() * layers[1].options.length)];
    const newLayer2 =
      layers[2].options[Math.floor(Math.random() * layers[2].options.length)];
    const newLayer3 =
      layers[3].options[Math.floor(Math.random() * layers[3].options.length)];
    const newLayer4 =
      layers[4].options[Math.floor(Math.random() * layers[4].options.length)];
    const newLayer5 =
      layers[5].options[Math.floor(Math.random() * layers[5].options.length)];
    const newLayer6 =
      layers[6].options[Math.floor(Math.random() * layers[6].options.length)];
    const newLayer7 =
      layers[7].options[Math.floor(Math.random() * layers[7].options.length)];
    const newLayer8 =
      layers[8].options[Math.floor(Math.random() * layers[8].options.length)];

    setLayer0(newLayer0);
    setLayer1(newLayer1);
    setLayer2(newLayer2);
    setLayer3(newLayer3);
    setLayer4(newLayer4);
    setLayer5(newLayer5);
    setLayer6(newLayer6);
    setLayer7(newLayer7);
    setLayer8(newLayer8);
  }

  function preloadImage(url) {
    const img = new Image();
    img.src = url;
  }

  return (
    <div className="App nft">
      <MainContentWrapper lock={false}>
        <div className="nft-section">
          <div className="right-section">
            <div
              className="nft-img-container"
              style={{
                height: "15vh",
                maxHeight: "50%",
                maxWidth: "15vh",
                minHeight: "15vh",
              }}
            >
              {/* {Object.values(layers).map((layer, index) => {
                return (
                  <img
                    style={{
                      objectPosition: "50% 0%",
                      scale: "1.6",
                      transform: "translate(10%, 0%)",
                    }}
                    key={index}
                    className="nft-img"
                    src={layer.value.img}
                    alt=""
                    loading="lazy"
                  />
                );
              })}
              <img
                style={{
                  objectPosition: "50% 0%",
                  scale: "1.6",
                  transform: "translate(10%, 0%)",
                }}
                className="nft-img"
                src={
                  layer2.name === "none"
                    ? noneImg
                    : NFT_PARTS[bearType][9][1].img
                }
                loading="lazy"
                alt=""
              /> */}
              <img
                ref={avatarImage}
                src=""
                alt=""
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
            <div
              ref={nftContainer}
              className="nft-img-container"
              style={{
                marginTop: "5%",
                width: nftContainer.current?.clientHeight * 0.89,
              }}
            >
              {Object.values(layers).map((layer, index) => {
                return (
                  <img
                    key={index}
                    className="nft-img"
                    src={layer.value.img}
                    alt=""
                    loading="lazy"
                  />
                );
              })}
              <img
                className="nft-img"
                src={
                  layer2.name === "none"
                    ? noneImg
                    : NFT_PARTS[bearType][9][1].img
                }
                alt=""
                loading="lazy"
              />
            </div>
          </div>
          <main className="main nft">
            <img src={bgImage} alt="" className="bg-img" />
            <h1 className="title">Choose Your NFT</h1>
            <div>
              <GeneralButton onClick={() => randomNFTHandler()}>
                Random
              </GeneralButton>
              <GeneralButton onClick={() => updateAvatarImage(true)}>
                Download
              </GeneralButton>
            </div>
            <GeneralDropDown
              value={bearType}
              setValue={() =>
                changeBearHandler(bearType === "pot" ? "predator" : "pot")
              }
              unitName="Bear"
              unitNamePos="left"
              options={bearOptions}
            ></GeneralDropDown>

            {Object.values(layers).map((layer, index) => {
              return (
                <GeneralDropDown
                  key={index}
                  value={layer.value.name}
                  setValue={(value) => {
                    layer.setValue(
                      layer.options.find((option) => option.name === value)
                    );
                  }}
                  unitName={layer.name}
                  unitNamePos="left"
                  options={layer.options.map((option) => option.name)}
                ></GeneralDropDown>
              );
            })}
          </main>
        </div>
      </MainContentWrapper>
    </div>
  );
}
