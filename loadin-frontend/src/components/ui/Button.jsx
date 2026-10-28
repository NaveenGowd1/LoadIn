import clsx from "clsx";

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",

  secondary:
    "bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg",

  outline:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",

  dark:
    "bg-slate-900 text-white hover:bg-black",

  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100",
};

const sizes = {
  sm: "px-4 py-2 text-sm",

  md: "px-6 py-3 text-base",

  lg: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className = "",
  disabled = false,
  leftIcon,
  rightIcon,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2",
        "rounded-xl font-semibold",
        "transition-colors duration-200",
        "focus:outline-none",
        "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "cursor-pointer",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-30"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />

            <path
              className="opacity-100"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>

          Loading...
        </>
      ) : (
        <>
          {leftIcon && (
            <span className="flex items-center">
              {leftIcon}
            </span>
          )}

          <span>{children}</span>

          {rightIcon && (
            <span className="flex items-center">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
}