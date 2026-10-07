import { ReactNode } from "react";
import "./GeneralButtonClean.css";

interface GeneralButtonCleanProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  containerStyle?: React.CSSProperties;
  loading?: boolean;
}

export default function GeneralButtonClean({
  children,
  onClick,
  containerStyle,
  loading = false,
  ...props
}: GeneralButtonCleanProps) {
  return (
    <div className="general-button-clean-container" style={containerStyle}>
      <button
        onClick={onClick}
        className={`general-button-clean ${props.className} ${loading ? 'loading' : ''}`}
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
