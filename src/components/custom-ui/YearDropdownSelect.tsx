import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearDropdownSelectProps {
  value?: number; // Current selected year
  onChange: (year: number) => void; // Callback when the year changes
  startYear?: number; // The first year in the dropdown
  endYear?: number; // The last year in the dropdown
}

const YearDropdownSelect: React.FC<YearDropdownSelectProps> = ({
  value,
  onChange,
  startYear = 1900, // Default: Start year is 1900
  endYear = new Date().getFullYear(), // Default: Current year
}) => {
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  return (
    <Select
      onValueChange={(val) => onChange(Number(val))}
      defaultValue={value?.toString()}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select year" />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default YearDropdownSelect;
