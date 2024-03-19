import "./Container.css";

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  align?: "left" | "center" | "right";
  justify?: "left" | "center" | "right";
  border?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  oneline?: boolean;
}

export default function Container({
  oneline,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={"honey-pot-design-container" + (oneline ? " oneline" : "")}
      {...props}
    >
      {children}
    </div>
  );
}
