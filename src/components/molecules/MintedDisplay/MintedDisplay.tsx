import useHoneyPot from "@/hooks/useHoneyPot";
//import { weiToEther } from "@/lib/currencyConvert";
import smokingMole from "@/assets/smoking-mole.png";

export default function MintedDisplay() {
  const {
    //getVIPNFTPrice,
    getMintedVIPNFTsCount,
    getTotalVIPNFTCount,
  } = useHoneyPot();

  return (
    <div className="minted-display">
      <h2 className="minted__title">Minted</h2>
      <p className="minted__amount">
        {getMintedVIPNFTsCount()}/{getTotalVIPNFTCount()}
      </p>

      <img src={smokingMole} alt="smoking-mole" className="smoking-mole" />
    </div>
  );
}
