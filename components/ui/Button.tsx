import Link from "next/link";
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  asChild?: boolean;
}

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  external?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-lemon text-background hover:bg-lemon/90",
  secondary: "bg-slate text-foreground hover:bg-slate/90",
  ghost: "bg-transparent text-foreground hover:bg-foreground/10",
};

const baseStyles = "inline-flex items-center justify-center font-semibold px-8 py-4 text-sm uppercase tracking-wider transition-all duration-200";

export function Button({ 
  variant = "primary", 
  className, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  );
}

export function ButtonLink({ 
  variant = "primary", 
  external = false,
  className, 
  ...props 
}: ButtonLinkProps) {
  const externalProps = external 
    ? { target: "_blank", rel: "noopener noreferrer" } 
    : {};

  return (
    <Link
      className={cn(baseStyles, variantStyles[variant], className)}
      {...externalProps}
      {...props}
    />
  );
}
