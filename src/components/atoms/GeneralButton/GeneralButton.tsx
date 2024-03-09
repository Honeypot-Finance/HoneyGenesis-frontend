import { ReactNode } from "react";
import "./GeneralButton.css";

export default function GeneralButton({
  children,
  onClick,
  disabled,
  className,
  style,
  containerStyle,
}: {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
}) {
  return (
    <div className="general-button-container" style={containerStyle}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`general-button ${className}`}
        style={style}
      >
        {children}
      </button>
    </div>
  );
}
