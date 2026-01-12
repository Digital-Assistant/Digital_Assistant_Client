import { cn } from "../lib/cn";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

/**
 * Reusable icon button component with theming support
 */
export function IconButton({
  children,
  variant = "ghost",
  size = "md",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        "relative shrink-0 transition-opacity hover:opacity-[var(--widget-button-hover-opacity)]",
        {
          "size-5": size === "sm",
          "size-6": size === "md",
          "size-7": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
