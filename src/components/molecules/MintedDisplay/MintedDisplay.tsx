import useHoneyPot from "@/hooks/useHoneyPot";
//import { weiToEther } from "@/lib/currencyConvert";
import smokingMole from "@/assets/smoking-mole.png";

export default function MintedDisplay({ isVIPMint = false }) {
  const {
    //getVIPNFTPrice,
    getMintedVIPNFTsCount,
    getTotalVIPNFTCount,
    getMintedAmount,
    getMaxAmount,
  } = useHoneyPot();

  return (
    <div className="minted-display">
      <h2 className="minted__title">Minted</h2>
      {isVIPMint ? (
        <p className="minted__amount">
          {getMintedVIPNFTsCount()}/{getTotalVIPNFTCount()}
        </p>
      ) : (
        <p className="minted__amount">
          {parseInt(getMintedAmount()) + parseInt(getMintedVIPNFTsCount())}/
          {parseInt(getMaxAmount()) + parseInt(getTotalVIPNFTCount())}
        </p>
      )}

      <img src={smokingMole} alt="smoking-mole" className="smoking-mole" />
    </div>
  );
}
