import { AlertCircle, CheckCircle, XCircle, Info, X } from "lucide-react";
import { ReactNode } from "react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  title?: string;
  message: ReactNode;
  className?: string;
  onClose?: () => void;
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    textColor: "text-green-400",
    iconColor: "text-green-500",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    textColor: "text-red-400",
    iconColor: "text-red-500",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    textColor: "text-yellow-400",
    iconColor: "text-yellow-500",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    textColor: "text-blue-400",
    iconColor: "text-blue-500",
  },
};

export default function Alert({
  type,
  title,
  message,
  className = "",
  onClose,
}: AlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start p-4 border rounded-xl backdrop-blur-md shadow-sm ${config.bgColor} ${config.borderColor} ${className}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
      <div className="ml-3 flex-1">
        {title && (
          <h3 className={`text-sm font-semibold ${config.textColor}`}>
            {title}
          </h3>
        )}
        <div className={`text-sm ${config.textColor} mt-1`}>{message}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-4 text-neutral-500 hover:text-neutral-700 transition-colors"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}