import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import clsx from "clsx";

export default function PasswordField({
  label,
  name,
  register,
  rules = {},
  error,
  placeholder,
  required = false,
  disabled = false,
})  {
  const [showPassword, setShowPassword] = useState(false);

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

        {/* Lock Icon */}

        <Lock
          size={18}
          className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-400
          "
        />

        <input
          id={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          {...register(name, rules)}
          className={clsx(
            "w-full",
            "rounded-xl",
            "border",
            "bg-white",
            "py-3",
            "pl-12",
            "pr-12",
            "text-slate-700",
            "placeholder:text-slate-400",
            "outline-none",
            "transition-all duration-200",

            error
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100",

            disabled && "bg-slate-100 cursor-not-allowed"
          )}
        />

        {/* Eye Icon */}

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-slate-400
          hover:text-blue-600
          transition
          "
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>

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