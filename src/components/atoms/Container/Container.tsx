import "./Container.css";

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  align?: "left" | "center" | "right";
  justify?: "left" | "center" | "right";
  border?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
}

export default function Container({ children, ...props }: ContainerProps) {
  return (
    <div className="honey-pot-design-container" {...props}>
      {children}
    </div>
  );
}
