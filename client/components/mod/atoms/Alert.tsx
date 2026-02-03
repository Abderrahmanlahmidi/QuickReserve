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
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
    textColor: "text-success",
    iconColor: "text-success",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-danger/10",
    borderColor: "border-danger/30",
    textColor: "text-danger",
    iconColor: "text-danger",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
    textColor: "text-warning",
    iconColor: "text-warning",
  },
  info: {
    icon: Info,
    bgColor: "bg-info/10",
    borderColor: "border-info/30",
    textColor: "text-info",
    iconColor: "text-info",
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
      className={`flex items-start p-4 border rounded-lg ${config.bgColor} ${config.borderColor} ${className}`}
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