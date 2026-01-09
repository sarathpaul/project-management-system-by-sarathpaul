import { HTMLAttributes } from "react";

type BadgeVariant = "success" | "danger" | "warning" | "info" | "default";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-600",
  danger: "bg-red-100 text-red-600",
  warning: "bg-orange-100 text-orange-600",
  info: "bg-blue-200 text-blue-600",
  default: "bg-gray-200 text-gray-600",
};

export default function Badge({
  variant = "default",
  children,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-3 py-1
        text-xs font-semibold
        rounded-[10px]
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
