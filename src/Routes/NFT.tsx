import MainContentWrapper from "@/components/template/MainContentWrapper/MainContentWrapper";
import GeneralDropDown from "@/components/atoms/GeneralDropDown/GeneralDropDown";
import NFT_PARTS from "@/assets/nft_sm";
import GeneralButton from "@/components/atoms/GeneralButton/GeneralButton";
import mergeImages from "merge-images";

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

              {/* 
              <GeneralButton onClick={() => bulkDownloadNfts(6000)}>
                Download All
              </GeneralButton> */}
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
});
export default NFT;
