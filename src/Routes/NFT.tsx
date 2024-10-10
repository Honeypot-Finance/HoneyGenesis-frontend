import MainContentWrapper from "@/components/template/MainContentWrapper/MainContentWrapper";
import GeneralDropDown from "@/components/atoms/GeneralDropDown/GeneralDropDown";
import NFT_PARTS, { layerOption } from "@/assets/nft_sm";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";
import mergeImages from "merge-images";

//imgs
import bgImage from "@/assets/forest-bg.png";
import { useEffect, useState, useRef, useCallback } from "react";
import noneImg from "@/assets/nft/None.png";

type layerType = {
  name: string;
  value: layerOption;
  constraints: string[];
};

export default function NFT() {
  const bearOptions = ["pot", "predator"];
  const avatarImage = useRef<HTMLImageElement>(null);
  const [bearType, setBearType] = useState("pot");
  const nftContainer = useRef<HTMLDivElement>(null);
  const [layers, setLayers] = useState<Record<number, layerType>>({
    0: {
      name: "Background",
      value: { name: "none", img: noneImg },
      constraints: [],
    },
    1: {
      name: "Bear",
      value: { name: "none", img: noneImg },
      constraints: [],
    },
    2: {
      name: "Nail",
      value: { name: "none", img: noneImg },
      constraints: [],
    },
    3: {
      name: "Emotion",
      value: { name: "none", img: noneImg },
      constraints: [],
    },
    4: {
      name: "Cloth",
      value: { name: "none", img: noneImg },
      constraints: [],
    },
    5: {
      name: "Hat",
      value: { name: "none", img: noneImg },
      constraints: [],
    },
    6: {
      name: "Glasses",
      value: { name: "none", img: noneImg },
      constraints: [],
    },
    7: {
      name: "Smoke",
      value: { name: "none", img: noneImg },
      constraints: [],
    },
    8: {
      name: "Handhold",
      value: { name: "none", img: noneImg },
      constraints: [],
    },
  });

  const getLayerOptionByName = useCallback(
    (layer: number, name: string, newbearType?: string) => {
      console.log(name);
      console.log(NFT_PARTS[newbearType ?? bearType][layer]);
      console.log(
        NFT_PARTS[newbearType ?? bearType][layer].find(
          (option) => option.name === name
        )
      );
      return NFT_PARTS[newbearType ?? bearType][layer].find(
        (option) => option.name === name
      );
    },
    [bearType]
  );

  const removeConstraint = (item: layerOption) => {
    if (!item.layerConstrain) {
      return;
    }
    Object.entries(item.layerConstrain).forEach(([key, value]) => {
      value.forEach((name) => {
        if (layers[parseInt(key)].constraints.includes(name)) {
          layers[parseInt(key)].constraints.splice(
            layers[parseInt(key)].constraints.indexOf(name),
            1
          );
        }
      });
    });
  };

  const addConstraint = (item: layerOption, bearType?: string) => {
    if (!item || !item.layerConstrain) {
      return;
    }
    Object.entries(item.layerConstrain).forEach(([key, value]) => {
      value.forEach((name) => {
        layers[parseInt(key)].constraints.push(name);
      });

      if (
        !layers[parseInt(key)].constraints.includes(
          layers[parseInt(key)].value.name
        )
      ) {
        setLayer(
          parseInt(key),
          getLayerOptionByName(
            parseInt(key),
            layers[parseInt(key)].constraints[0],
            bearType
          )
        );
      }
    });
  };

  // const layerContraintHandler = (layer: number, value?: layerOption) => {
  //   const layerConstrain = NFT_PARTS[bearType][layer].find((option) => {
  //     return option.name === (value ? value.name : layers[layer].value.name);
  //   })?.layerConstrain;

  //   if (!layerConstrain) {
  //     refreshSingleLayerOptions(layer);
  //     return;
  //   }

  //   Object.entries(layerConstrain).forEach(([key, value]) => {
  //     const targetOptions = NFT_PARTS[bearType][parseInt(key)].filter(
  //       (option) => {
  //         if (value.includes(option.name)) {
  //           return true;
  //         } else {
  //           return false;
  //         }
  //       }
  //     );

  //     refreshSingleLayerOptions(parseInt(key), targetOptions);
  //   });
  // };

  const setLayer = (layer: number, value: layerOption, bearType?: string) => {
    removeConstraint(layers[layer].value);
    setLayers((prev) => {
      const newLayers = { ...prev };
      newLayers[layer].value = value;
      return newLayers;
    });
    addConstraint(value, bearType);
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
        Object.values(layers).map((layer) => {
          return { src: layer.value.img, x: -xPadding, y: -yPadding };
        }),
        {
          width: imageSize,
          height: imageSize,
        }
      ).then((img) => {
        avatarImage.current.src = img;

        if (download) {
          urltoFile(img, "nft.png", "base64").then(function (file) {
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
    [layers]
  );

  useEffect(() => {
    randomNFTHandler();
  }, []);

  useEffect(() => {
    updateAvatarImage();
  }, [bearType, layers, updateAvatarImage]);

  // function refreshLayerOptions(bear: string = bearType) {
  //   for (const key in layers) {
  //     const layer = layers[key];
  //     layer.options = [];
  //     for (let i = 0; i < NFT_PARTS[bear][key].length; i++) {
  //       layer.options.push(NFT_PARTS[bear][key][i]);
  //     }
  //   }
  // }

  // function refreshSingleLayerOptions(layer: number, options?: layerOption[]) {
  //   if (options) {
  //     setLayers((prev) => {
  //       const newLayers = {
  //         ...prev,
  //         [layer]: { ...prev[layer], options: options },
  //       };
  //       return newLayers;
  //     });
  //     return;
  //   } else {
  //     setLayers((prev) => {
  //       const newOptions = [];
  //       for (let i = 0; i < NFT_PARTS[bearType][layer].length; i++) {
  //         newOptions.push(NFT_PARTS[bearType][layer][i]);
  //       }
  //       const newLayers = {
  //         ...prev,
  //         [layer]: { ...prev[layer], options: newOptions },
  //       };

  //       return newLayers;
  //     });
  //   }
  // }

  function changeBearHandler(value: string) {
    setBearType(value);
    //refreshLayerOptions(value);
    for (const key in layers) {
      setLayer(parseInt(key), NFT_PARTS[value][parseInt(key)][0]);
    }
  }

  function randomNFTHandler() {
    //remove all layer constraints
    for (const key in layers) {
      removeConstraint(layers[parseInt(key)].value);
    }

    const layerConstraints = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
    };

    const newBearType =
      bearOptions[Math.floor(Math.random() * bearOptions.length)];
    setBearType(newBearType);
    //refreshLayerOptions(newBearType);

    for (const key in layers) {
      const newLayer =
        layerConstraints[parseInt(key)].length > 0
          ? NFT_PARTS[newBearType][parseInt(key)][
              Math.floor(
                Math.random() * NFT_PARTS[newBearType][parseInt(key)].length
              )
            ]
          : NFT_PARTS[newBearType][parseInt(key)][
              Math.floor(
                Math.random() * NFT_PARTS[newBearType][parseInt(key)].length
              )
            ];

      for (const [key, value] of Object.entries(newLayer.layerConstrain)) {
        layerConstraints[key].push(value);
      }

      setLayer(parseInt(key), newLayer, newBearType);
    }

    console.log(layers);
  }

  const getLayersValue = useCallback(() => {
    return Object.values(layers);
  }, [layers]);

  return (
    <div className="App nft">
      <MainContentWrapper lock={false}>
        <div className="nft-section">
          <div className="right-section">
            <div
              className="nft-img-container"
              style={{
                width: "unset",
                height: "unset",
                minWidth: "200px",
                minHeight: "200px",
                maxWidth: "200px",
                maxHeight: "200px",
                aspectRatio: "1/1",
                flexGrow: 0,
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
                height: "100%",
                width: "auto",
                aspectRatio: "500/590",
                flexGrow: 1,
              }}
            >
              {getLayersValue()?.map((layer, index) => {
                return (
                  <img
                    key={index}
                    className="nft-img"
                    src={layer.value.img}
                    alt=""
                  />
                );
              })}
              <img
                className="nft-img"
                src={NFT_PARTS[bearType][9][0].img}
                alt=""
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
              {/**<GeneralButton onClick={() => downloadAllPossibleNFTs()}>
                Download All
              </GeneralButton>*/}
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

            {getLayersValue().map((layer, index) => {
              return (
                NFT_PARTS[bearType][index].length > 1 && (
                  <GeneralDropDown
                    key={index}
                    value={layer.value.name}
                    setValue={(value) => {
                      setLayer(
                        index,
                        NFT_PARTS[bearType][index].find(
                          (option) => option.name === value
                        )
                      );
                    }}
                    unitName={layer.name}
                    unitNamePos="left"
                    options={NFT_PARTS[bearType][index].map(
                      (option) => option.name
                    )}
                    enabledOptions={layer.constraints ?? []}
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
