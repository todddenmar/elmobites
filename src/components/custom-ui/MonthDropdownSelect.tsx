// components/MonthDropdownSelect.tsx
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthDropdownSelectProps {
  value?: number; // 1 (January) to 12 (December)
  onChange: (month: number) => void; // Callback when the month changes
}

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const MonthDropdownSelect: React.FC<MonthDropdownSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <Select
      onValueChange={(val) => onChange(Number(val))}
      defaultValue={value?.toString()}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select month" />
      </SelectTrigger>
      <SelectContent>
        {months.map((month) => (
          <SelectItem key={month.value} value={month.value.toString()}>
            {month.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MonthDropdownSelect;
