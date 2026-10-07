import "./GeneralInput.css";

interface GeneralInputProps extends React.HTMLProps<HTMLInputElement> {
  value: string;
  setValue: (value: string) => void;
  unitName: string;
  unitNamePos?: "left" | "right";
}

export default function GeneralInput({
  value,
  setValue,
  unitName,
  unitNamePos = "right",
  ...props
}: GeneralInputProps) {
  return (
    <div className="amount-input-container" {...props}>
      {unitNamePos === "left" && <div className="unit-name">{unitName}</div>}
      <input
        className="amount-input"
        type="text"
        id="value"
        name="value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={props.placeholder}
      />

      {unitNamePos === "right" && <div className="unit-name">{unitName}</div>}
    </div>
  );
}
