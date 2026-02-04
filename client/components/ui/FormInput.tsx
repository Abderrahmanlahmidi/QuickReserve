"use client";

import { useState, forwardRef } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  className?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon: Icon, error, className = "", type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-neutral-300 tracking-wide ml-1">
          {label}
        </label>
        <div className="relative group">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors duration-200">
              <Icon size={18} />
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all duration-200 placeholder:text-neutral-600 text-white shadow-inner ${Icon ? "pl-11" : "pl-4"
              } ${error
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
                : "hover:border-white/20"
              } ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs font-medium text-red-400 ml-1 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;