import { Pressable, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  onPress,
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
}: ButtonProps) {
  const baseStyles = "items-center justify-center rounded-xl";

  const variantStyles = {
    primary: "bg-espresso active:bg-espresso-dark",
    secondary: "bg-coffee-700 active:bg-coffee-600",
    ghost: "bg-transparent active:bg-coffee-700",
  };

  const sizeStyles = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const disabledStyles = disabled ? "opacity-50" : "";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="#f5f0eb" />
      ) : (
        <Text
          className={`font-semibold text-cream-100 ${textSizes[size]}`}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}
