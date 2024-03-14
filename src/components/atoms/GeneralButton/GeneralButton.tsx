import { ReactNode } from "react";
import "./GeneralButton.css";

interface GeneralButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  containerStyle?: React.CSSProperties;
}

export default function GeneralButton({
  children,
  onClick,
  containerStyle,
  ...props
}: GeneralButtonProps) {
  return (
    <div className="general-button-container" style={containerStyle}>
      <button
        onClick={onClick}
        className={`general-button ${props.className}`}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
