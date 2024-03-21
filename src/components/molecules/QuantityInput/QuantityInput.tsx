import { useEffect, useRef } from "react";
import { useAccount, useBalance } from "wagmi";

//import { maxMintAmount } from "@/consts";
import { weiToEther } from "@/lib/currencyConvert";
import useHoneyPot from "@/hooks/useHoneyPot";

import { chainUnit } from "@/consts";

import NumberInput from "@/components/atoms/NumberInput/NumberInput";
import "./QuantityInput.css";

export default function QuantityInput({
  inputName,
  value,
  setValue,
  vip = false,
}: {
  inputName: string;
  value: number;
  setValue: (value: number) => void;
  vip?: boolean;
}) {
  const maxButton = useRef<HTMLSpanElement>(null);
  const {
    getCurrentPrice,
    getTotalPrice,
    getKingdomlyFee,
    //getTotalPriceWithFee,
  } = useHoneyPot();
  const { address, chainId } = useAccount();
  const balance = useBalance({
    address: address,
  });

  //amount handling
  // useEffect(() => {
  //   if (value <= 0) {
  //     setValue(0);
  //   }

  //   if (value > maxMintAmount) {
  //     setValue(maxMintAmount);
  //   }

  //   if (!balance.data || !balance.data.value || !balance.data.decimals) return;

  //   const singlePrice = getTotalPriceWithFee(vip, value);

  //   const balanceInFloat = parseFloat(
  //     (
  //       parseInt(balance.data.value.toString()) /
  //       Math.pow(10, balance.data.decimals)
  //     ).toPrecision(5)
  //   );

  //   if (singlePrice * value > balanceInFloat) {
  //     setValue(Math.floor(balanceInFloat / singlePrice));
  //   }
  // }, [balance.data, getTotalPriceWithFee, setValue, value, vip]);

  //max button handling
  useEffect(() => {
    if (maxButton.current) {
      maxButton.current.onclick = () => {
        if (!balance.data || !balance.data.value || !balance.data.decimals)
          return;

        const singlePrice = weiToEther(parseInt(getCurrentPrice()));

        const balanceInFloat = parseFloat(
          (
            parseInt(balance.data.value.toString()) /
            Math.pow(10, balance.data.decimals)
          ).toPrecision(5)
        );

        setValue(Math.floor(balanceInFloat / singlePrice));
      };
    }
  }, [balance.data, getCurrentPrice, setValue]);

  return (
    <div className="quantity-input" style={{ gridColumn: "span 3" }}>
      <label className="amount-label" htmlFor="amount">
        {inputName}
      </label>
      <div className="extra-operation">
        Balance:{" "}
        {balance.data && weiToEther(parseInt(balance.data.value.toString()))}{" "}
        <span ref={maxButton} className="max-button">
          MAX
        </span>
      </div>
      <NumberInput
        value={value}
        setValue={setValue}
        unitName="UNIT"
        style={{ gridColumnStart: 1, gridColumnEnd: 3 }}
      />
      <div className="total-price">
        Total Price:{" "}
        {getTotalPrice(vip, value).toPrecision(5) +
          " " +
          (chainUnit[chainId] ? chainUnit[chainId] : "ETH")}{" "}
        <span className="half-transparent">
          + Kingdomly Fee :{getKingdomlyFee(vip, value).toPrecision(5)}{" "}
          {chainUnit[chainId] ? chainUnit[chainId] : "ETH"}
        </span>
      </div>
    </div>
  );
}
