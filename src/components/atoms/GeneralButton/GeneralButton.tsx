import { ReactNode } from "react";
import "./GeneralButton.css";

interface GeneralButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  containerStyle?: React.CSSProperties;
  loading?: boolean;
}

export default function GeneralButton({
  children,
  onClick,
  containerStyle,
  loading = false,
  ...props
}: GeneralButtonProps) {
  return (
    <div className="general-button-container" style={containerStyle}>
      <button
        onClick={onClick}
        className={`general-button ${props.className} ${loading ? 'loading' : ''}`}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="button-loading">
            <span className="spinner"></span>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    </div>
  );
}
