import MainContentWrapper from "@/components/template/MainContentWrapper/MainContentWrapper";
import GeneralDropDown from "@/components/atoms/GeneralDropDown/GeneralDropDown";

//imgs
import bgImage from "@/assets/forest-bg.png";
import nftV2 from "@/assets/nft-v2.jpg";
import { useState } from "react";

export default function NFT() {
  const [bearType, setBearType] = useState("white");
  const [face, setFace] = useState("normal");
  const [cloth, setCloth] = useState("normal");
  const [weapon, setWeapon] = useState("normal");

  const bearOptions = ["white", "black", "brown"];
  const faceOptions = ["normal", "smile", "angry"];
  const clothOptions = ["normal", "armor", "ninja"];
  const weaponOptions = ["normal", "sword", "gun"];

  return (
    <div className="App nft">
      <MainContentWrapper lock={false}>
        <div className="nft-section">
          <div className="right-section">
            <div className="nft-img-container">
              <img className="nft-img" src={nftV2} alt="Nft Image" />
            </div>
          </div>
          <main className="main nft">
            <img src={bgImage} alt="" className="bg-img" />
            <h1 className="title">Choose Your NFT</h1>
            <GeneralDropDown
              value={bearType}
              setValue={setBearType}
              unitName="Bear"
              options={bearOptions}
            ></GeneralDropDown>

            <GeneralDropDown
              value={face}
              setValue={setFace}
              unitName="Face"
              options={faceOptions}
            ></GeneralDropDown>

            <GeneralDropDown
              value={cloth}
              setValue={setCloth}
              unitName="Cloth"
              options={clothOptions}
            ></GeneralDropDown>

            <GeneralDropDown
              value={weapon}
              setValue={setWeapon}
              unitName="Weapon"
              options={weaponOptions}
            ></GeneralDropDown>
          </main>
        </div>
      </MainContentWrapper>
    </div>
  );
}
