import "./GeneralDropDown.css";

interface GeneralDropDownProps extends React.HTMLProps<HTMLInputElement> {
  value: string;
  setValue: (value: string) => void;
  unitName: string;
  unitNamePos?: "left" | "right";
  options: string[];
}

export default function GeneralDropDown({
  value,
  setValue,
  unitName,
  options,
  unitNamePos = "right",
  ...props
}: GeneralDropDownProps) {
  return (
    <div className="amount-input-container" {...props}>
      {unitNamePos === "left" && <div className="unit-name">{unitName}</div>}
      <select
        className="select"
        value={value}
        onChange={(value) => {
          setValue(value.target.value);
        }}
      >
        {options.map((option) => (
          <option className="option" key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {unitNamePos === "right" && <div className="unit-name">{unitName}</div>}
    </div>
  );
}
