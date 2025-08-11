import React from "react";

interface SelectItem {
  instanceId: string;
  label: string;
}

interface CommonSelectProps {
  items: SelectItem[];
  selectedValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  displayValue?: (item: SelectItem) => string;
  getKey?: (item: SelectItem) => string;
  className?: string;
}

const CommonSelect: React.FC<CommonSelectProps> = ({
  items,
  selectedValue,
  onChange,
  placeholder,
  displayValue = (item) => item.label,
  getKey = (item) => item.instanceId,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
      >
        <option value="" disabled>
          {placeholder || "Select an option"}
        </option>
        {items.map((item) => (
          <option key={getKey(item)} value={getKey(item)}>
            {displayValue(item)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CommonSelect;
