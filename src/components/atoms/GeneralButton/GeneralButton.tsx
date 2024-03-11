import { ReactNode } from "react";
import "./GeneralButton.css";

interface GeneralButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  containerStyle?: React.CSSProperties;
}

export default function GeneralButton({
  children,
  onClick,
  disabled,
  className,
  containerStyle,
  ...props
}: GeneralButtonProps) {
  return (
    <div className="general-button-container" style={containerStyle}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`general-button ${className}`}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
