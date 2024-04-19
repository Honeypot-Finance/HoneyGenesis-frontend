import "./GeneralDropDown.css";

interface GeneralDropDownProps extends React.HTMLProps<HTMLInputElement> {
  value: string;
  setValue: (value: string) => void;
  unitName: string;
  options: string[];
}

export default function GeneralDropDown({
  value,
  setValue,
  unitName,
  options,
  ...props
}: GeneralDropDownProps) {
  return (
    <div className="amount-input-container" {...props}>
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
      <div className="unit-name">{unitName}</div>
    </div>
  );
}
