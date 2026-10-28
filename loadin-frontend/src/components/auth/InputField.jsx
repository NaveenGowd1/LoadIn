import clsx from "clsx";

export default function InputField({
  label,
  name,
  type = "text",
  placeholder,
  register,
  rules = {},
  error,
  icon,
  required = false,
  disabled = false,
}) {
  return (
    <div className="space-y-2">

      {/* Label */}

      <label
        htmlFor={name}
        className="block text-sm font-semibold text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {/* Input */}

      <div className="relative">

        {/* Left Icon */}

        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name, rules)}
        className={clsx(
            "w-full rounded-xl border bg-white",
            "py-3",
            icon ? "pl-12 pr-4" : "px-4",
            "text-slate-700",
            "placeholder:text-slate-400",
            "outline-none",
            "transition-all duration-200",

            error
            ? "border-red-400 focus:ring-4 focus:ring-red-100 focus:border-red-500"
            : "border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500",

            disabled && "bg-slate-100 cursor-not-allowed"
        )}
        />

      </div>

      {/* Error */}

      {error && (
        <p className="text-sm text-red-500">
          {error.message}
        </p>
      )}

    </div>
  );
}