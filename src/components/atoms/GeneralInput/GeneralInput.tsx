import "./GeneralInput.css";

interface GeneralInputProps extends React.HTMLProps<HTMLInputElement> {
  value: string;
  setValue: (value: string) => void;
  unitName: string;
}

export default function GeneralInput({
  value,
  setValue,
  unitName,
  ...props
}: GeneralInputProps) {
  return (
    <div className="amount-input-container" {...props}>
      <input
        className="amount-input"
        type="text"
        id="value"
        name="value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <div className="unit-name">{unitName}</div>
    </div>
  );
}
