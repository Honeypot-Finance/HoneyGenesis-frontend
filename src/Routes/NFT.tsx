import MainContentWrapper from "@/components/template/MainContentWrapper/MainContentWrapper";
import GeneralDropDown from "@/components/atoms/GeneralDropDown/GeneralDropDown";
import NFT_PARTS from "@/assets/nft_sm";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";
import mergeImages from "merge-images";

//imgs
import bgImage from "@/assets/forest-bg.png";
import { useEffect, useState, useRef, useCallback } from "react";
import noneImg from "@/assets/nft/None.png";

type layerType = {
  name: string;
  value: layerOption;
  setValue: (value: layerOption) => void;
  options: layerOption[];
};

type layerOption = {
  name: string;
  img: string;
  layerConstrain?: Record<number, string[]>;
};

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
  const layers: Record<number, layerType> = {
    0: {
      name: "Background",
      value: layer0,
      setValue: setLayer0,
      options: [],
    },
    1: {
      name: "Bear",
      value: layer1,
      setValue: (value) => {
        setLayer(1, value);
      },
      options: [],
    },
    2: {
      name: "Nail",
      value: layer2,
      setValue: (value) => {
        setLayer(2, value);
      },
      options: [],
    },
    3: {
      name: "Emotion",
      value: layer3,
      setValue: (value) => {
        setLayer(3, value);
      },
      options: [],
    },
    4: {
      name: "Cloth",
      value: layer4,
      setValue: (value) => {
        setLayer(4, value);
      },
      options: [],
    },
    5: {
      name: "Hat",
      value: layer5,
      setValue: (value) => {
        setLayer(5, value);
      },
      options: [],
    },
    6: {
      name: "Glasses",
      value: layer6,
      setValue: (value) => {
        setLayer(6, value);
      },
      options: [],
    },
    7: {
      name: "Smoke",
      value: layer7,
      setValue: (value) => {
        setLayer(7, value);
      },
      options: [],
    },
    8: {
      name: "Handhold",
      value: layer8,
      setValue: (value) => {
        setLayer(8, value);
      },
      options: [],
    },
  };

  const layerContraintHandler = (layer: number) => {
    console.log(NFT_PARTS[bearType][layer]);
    console.log(layers[layer].value);
    const layerConstrain = NFT_PARTS[bearType][layer].find(
      (option) => option.name === layers[layer].value.name
    )?.layerConstrain;

    console.log(layerConstrain);
    if (layerConstrain) {
      refreshSingleLayerOptions(
        layer,
        NFT_PARTS[bearType][layer].filter((option) => {
          for (const key in layerConstrain) {
            if (layerConstrain[key].includes(option.name)) {
              return true;
            }
          }
          return false;
        })
      );
    }
  };

  const setLayer = (layer: number, value: layerOption) => {
    switch (layer) {
      case 0:
        setLayer0(value);
        layerContraintHandler(0);
        break;
      case 1:
        setLayer1(value);
        layerContraintHandler(1);
        break;
      case 2:
        setLayer2(value);
        layerContraintHandler(2);
        break;
      case 3:
        setLayer3(value);
        layerContraintHandler(3);
        break;
      case 4:
        setLayer4(value);
        console.log(value);
        layerContraintHandler(4);
        break;
      case 5:
        setLayer5(value);
        layerContraintHandler(5);
        break;
      case 6:
        setLayer6(value);
        layerContraintHandler(6);
        break;
      case 7:
        setLayer7(value);
        layerContraintHandler(7);
        break;
      case 8:
        setLayer8(value);
        layerContraintHandler(8);
        break;
    }
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

      const xPadding = 0;
      const yPadding = 50;
      const imageSize = 400;
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
    console.log(layers);
  }

  function refreshSingleLayerOptions(layer: number, options?: layerOption[]) {
    const layerOption = layers[layer];
    layerOption.options = options ?? [];
    console.log(layerOption.options);
    if (options) {
      return;
    }
    for (let i = 0; i < NFT_PARTS[bearType][layer].length; i++) {
      layerOption.options.push(NFT_PARTS[bearType][layer][i]);
    }
  }

  function changeBearHandler(value: string) {
    setBearType(value);
    refreshLayerOptions(value);
    setLayer(0, layers[0].options[0]);
    setLayer(1, layers[1].options[0]);
    setLayer(2, layers[2].options[0]);
    setLayer(3, layers[3].options[0]);
    setLayer(4, layers[4].options[0]);
    setLayer(5, layers[5].options[0]);
    setLayer(6, layers[6].options[0]);
    setLayer(7, layers[7].options[0]);
    setLayer(8, layers[8].options[0]);
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

    setLayer(0, newLayer0);
    setLayer(1, newLayer1);
    setLayer(2, newLayer2);
    setLayer(3, newLayer3);
    setLayer(4, newLayer4);
    setLayer(5, newLayer5);
    setLayer(6, newLayer6);
    setLayer(7, newLayer7);
    setLayer(8, newLayer8);
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
                src={NFT_PARTS[bearType][9][0].img}
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
              unitName="Faction"
              unitNamePos="left"
              options={bearOptions}
            ></GeneralDropDown>

            {Object.values(layers).map((layer, index) => {
              return (
                layer.options.length > 1 && (
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
                )
              );
            })}
          </main>
        </div>
      </MainContentWrapper>
    </div>
  );
}
