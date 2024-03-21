import { useEffect, useRef } from "react";
import plus from "@/assets/plus.png";
import minus from "@/assets/minus.png";
import "./NumberInput.css";

export default function NumberInput({
  value,
  setValue,
  unitName,
  style,
  step,
}: {
  value: number;
  setValue: (value: number) => void;
  unitName: string;
  style?: React.CSSProperties;
  step?: number;
}) {
  const plusRef = useRef<HTMLImageElement>(null);
  const minusRef = useRef<HTMLImageElement>(null);

  function increaseAmount() {
    setValue(value + 1);
  }

  function decreaseAmount() {
    if (value > 0) {
      setValue(value - 1);
    }
  }

  useEffect(() => {
    if (value <= 0) {
      minusRef.current?.classList.add("disabled");
    } else {
      minusRef.current?.classList.remove("disabled");
    }
  }, [value]);

  return (
    <div className="amount-input-container" style={style}>
      <input
        className="amount-input"
        type="number"
        id="amount"
        name="amount"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        step={step}
      />
      <img
        ref={plusRef}
        className="plus"
        src={plus}
        alt="plus"
        onClick={increaseAmount}
      />
      <img
        ref={minusRef}
        className="minus"
        src={minus}
        alt="minus"
        onClick={decreaseAmount}
      />
      <div className="unit-name">{unitName}</div>
    </div>
  );
}
