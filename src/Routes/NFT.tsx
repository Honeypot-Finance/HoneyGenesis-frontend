import MainContentWrapper from "@/components/template/MainContentWrapper/MainContentWrapper";
import GeneralDropDown from "@/components/atoms/GeneralDropDown/GeneralDropDown";
import NFT_PARTS from "@/assets/nft_sm";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";
import mergeImages from "merge-images";
import { generate_setting } from "@/assets/nft_sm/bulk_generating_index";

//imgs
import bgImage from "@/assets/forest-bg.png";
import { useEffect, useRef, useCallback } from "react";
import { observer } from "mobx-react-lite";
import nftStore, { bearOptions } from "@/lib/NFT";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const NFT = observer(() => {
  const avatarImage = useRef<HTMLImageElement>(null);
  const nftContainer = useRef<HTMLDivElement>(null);

  const updateAvatarImage = useCallback(
    async (option?: { download?: boolean; returnUrl?: boolean }) => {
      async function urltoFile(url, filename, mimeType) {
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

      const res = mergeImages(
        Object.values(nftStore.layers).map((layer) => {
          return { src: layer.value.img, x: -xPadding, y: -yPadding };
        }),
        {
          width: imageSize,
          height: imageSize,
        }
      ).then(async (img) => {
        avatarImage.current.src = img;

        if (option.download) {
          const res = await urltoFile(img, "nft.png", "base64").then(function (
            file
          ) {
            const url = URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = url;
            a.download = "nft.png";
            a.click();
            URL.revokeObjectURL(url);
            return url;
          });

          return res;
        }

        if (option.returnUrl) {
          const res = await urltoFile(img, "nft.png", "base64").then(function (
            file
          ) {
            const url = URL.createObjectURL(file);
            return url;
          });

          return res;
        }
      });

      return res;
    },
    [nftStore.layers]
  );

  const bulkDownloadNfts = useCallback(
    async (count: number) => {
      const zip = new JSZip();
      for (let i = 0; i < count; i++) {
        nftStore.randomNFT();
        const url = await updateAvatarImage({ returnUrl: true });
        await fetch(url).then(async (res) => {
          const blob = await res.blob();
          zip.file(`nft-${i}.png`, blob);
          console.log(i, url);
        });
      }

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "nfts.zip");
      });
    },
    [updateAvatarImage]
  );

  const downloadPresets = async (generateType: "random" | "all" = "random") => {
    const zip = new JSZip();
    const keys = Object.keys(generate_setting);

    if (generateType === "random") {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = generate_setting[key];
        nftStore.setBearType(value.type);

        for (let i = 0; i < value.totalOutput; i++) {
          const constraints = {
            0: undefined,
            1: undefined,
            2: undefined,
            3: undefined,
            4: undefined,
            5: undefined,
            6: undefined,
            7: undefined,
            8: undefined,
            9: undefined,
          };
          for (let j = 0; j < Object.keys(value.layers).length; j++) {
            let v;

            if (constraints[j]) {
              v = value.layers[j].find((layer) => {
                return layer.name === constraints[j];
              });
            } else {
              v =
                value.layers[j][
                  Math.floor(Math.random() * value.layers[j].length)
                ];
            }

            nftStore.setLayerValue(j, v);
            if (v.layerConstrain) {
              Object.keys(v.layerConstrain).forEach((key) => {
                constraints[key] = v.layerConstrain[0];
              });
            }

            console.log(key, j);
          }

          const url = await updateAvatarImage({ returnUrl: true });
          await fetch(url).then(async (res) => {
            const blob = await res.blob();
            zip.folder(key).file(`nft-${i}.png`, blob);
            URL.revokeObjectURL(url);
          });
        }
      }
    } else if (generateType === "all") {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = generate_setting[key];
        nftStore.setBearType(value.type);

        //generate every possible combination
        for (let b = 0; b < value.layers[0].length; i++) {
          for (let j = 0; j < value.layers[1].length; j++) {
            for (let k = 0; k < value.layers[2].length; k++) {
              for (let l = 0; l < value.layers[3].length; l++) {
                for (let m = 0; m < value.layers[4].length; m++) {
                  for (let n = 0; n < value.layers[5].length; n++) {
                    for (let o = 0; o < value.layers[6].length; o++) {
                      for (let p = 0; p < value.layers[7].length; p++) {
                        for (let q = 0; q < value.layers[8].length; q++) {
                          for (let r = 0; r < value.layers[9].length; r++) {
                            nftStore.setLayerValue(0, value.layers[0][i]);
                            nftStore.setLayerValue(1, value.layers[1][j]);
                            nftStore.setLayerValue(2, value.layers[2][k]);
                            nftStore.setLayerValue(3, value.layers[3][l]);
                            nftStore.setLayerValue(4, value.layers[4][m]);
                            nftStore.setLayerValue(5, value.layers[5][n]);
                            nftStore.setLayerValue(6, value.layers[6][o]);
                            nftStore.setLayerValue(7, value.layers[7][p]);
                            nftStore.setLayerValue(8, value.layers[8][q]);
                            nftStore.setLayerValue(9, value.layers[9][r]);

                            const url = await updateAvatarImage({
                              returnUrl: true,
                            });
                            await fetch(url).then(async (res) => {
                              const blob = await res.blob();
                              zip
                                .folder(key)
                                .file(
                                  `nft-${i}-${b}-${j}-${k}-${l}-${m}-${n}-${o}-${p}-${q}-${r}.png`,
                                  blob
                                );
                              URL.revokeObjectURL(url);
                            });
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    await zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "presets_nfts.zip");
    });
  };

  useEffect(() => {
    nftStore.randomNFT();
    updateAvatarImage({});
  }, []);

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
              {Object.values(nftStore.layers).map((layer, index) => {
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
                src={NFT_PARTS[nftStore.bearType][9][0].img}
                alt=""
              />
            </div>
          </div>
          <main className="main nft">
            <img src={bgImage} alt="" className="bg-img" />
            <h1 className="title">Choose Your NFT</h1>
            <div>
              <GeneralButton
                onClick={() => {
                  nftStore.randomNFT();
                  updateAvatarImage();
                }}
              >
                Random
              </GeneralButton>
              <GeneralButton
                onClick={() =>
                  updateAvatarImage({
                    download: true,
                  })
                }
              >
                Download
              </GeneralButton>

              <GeneralButton
                onClick={() => bulkDownloadNfts(6000)}
                //remove this style to enable bulk download
                style={{
                  display: "none",
                }}
              >
                Download All
              </GeneralButton>

              <GeneralButton
                onClick={() => downloadPresets("random")}
                //remove this style to enable bulk download
                // style={{
                //   display: "none",
                // }}
              >
                Download Presets(random)
              </GeneralButton>
              <GeneralButton
                onClick={() => downloadPresets("all")}
                //remove this style to enable bulk download
                // style={{
                //   display: "none",
                // }}
              >
                Download Presets(every possible)
              </GeneralButton>
            </div>
            <GeneralDropDown
              value={nftStore.bearType}
              setValue={() =>
                nftStore.setBearType(
                  nftStore.bearType === "pot" ? "predator" : "pot"
                )
              }
              unitName="Faction"
              unitNamePos="left"
              options={bearOptions}
            ></GeneralDropDown>

            {Object.values(nftStore.layers).map((layer, index) => {
              return (
                NFT_PARTS[nftStore.bearType][index].length > 1 && (
                  <GeneralDropDown
                    key={index}
                    value={layer.value.name}
                    setValue={(value) => {
                      nftStore.setLayer(index, value);
                    }}
                    unitName={layer.name}
                    unitNamePos="left"
                    options={NFT_PARTS[nftStore.bearType][index].map(
                      (option) => option.name
                    )}
                    enabledOptions={
                      layer.constraints && layer.constraints.length > 0
                        ? layer.constraints
                        : NFT_PARTS[nftStore.bearType][index]
                            .filter((option) => !option.defaultHidden)
                            .map((option) => option.name)
                    }
                  ></GeneralDropDown>
                )
              );
            })}
          </main>
        </div>
      </MainContentWrapper>
    </div>
  );
});
export default NFT;
