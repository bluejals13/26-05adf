import "./Button.css";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "danger";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}


export default function Button({
  children,
  variant = "primary",
  className = "",
  disabled,
  onClick
}: ButtonProps) {

  return (
    <button
      className={`btn btn-${variant} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
