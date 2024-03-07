import { ReactNode } from "react";
import "./GeneralButton.css";

export default function GeneralButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className="general-button-container">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`general-button ${className}`}
      >
        {children}
      </button>
    </div>
  );
}
