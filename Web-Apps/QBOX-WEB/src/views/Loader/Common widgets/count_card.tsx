import type { LucideIcon } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  valueFontSize?: string;
  description: string;
  icon: LucideIcon;
  actionText?: string;
  actionHandler?: () => void;
  iconColor?: string;
  valueColor?: string;
  isDisabled?: boolean; // 👈 added this
}

export function StatCard({
  title,
  value,
  valueFontSize = "2xl",
  description,
  icon: Icon,
  actionText,
  actionHandler = () => { },
  iconColor = "low-bg-color",
  valueColor = "text-color",
  isDisabled = false, // 👈 default false
}: StatCardProps) {
  return (
    <div className="low-bg-color rounded-lg p-4 flex flex-col items-start">
      {/* <div className={`${iconColor} p-3 rounded-full mb-3`}>
        <Icon className="h-5 w-5 text-color" />
      </div> */}
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
      <p className={`font-bold ${valueColor} my-1`} style={{ fontSize: valueFontSize }}>
        {value}
      </p>
      <p className="text-sm text-gray-500 mb-4">{description}</p>

      {actionText ? (
        <button
          onClick={isDisabled ? undefined : actionHandler}
          disabled={isDisabled}
          className={`py-2 px-4 rounded-md text-sm font-medium w-full text-center transition-colors
          ${isDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-color text-white hover:bg-color"
            }`}
        >
          {actionText}
        </button>
      ) : null}
    </div>
  );
}
