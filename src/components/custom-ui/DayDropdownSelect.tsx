import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DayDropdownSelectProps {
  selectedYear?: number; // Selected year
  selectedMonth?: number; // Selected month (1-12)
  value?: number; // Currently selected day
  onChange: (day: number) => void; // Callback when a day is selected
}

const DayDropdownSelect: React.FC<DayDropdownSelectProps> = ({
  selectedYear,
  selectedMonth,
  value,
  onChange,
}) => {
  const [days, setDays] = useState<number[]>([]);

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      // Calculate the number of days in the given month and year
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    } else {
      setDays([]);
    }
  }, [selectedYear, selectedMonth]);

  return (
    <Select
      onValueChange={(val) => onChange(Number(val))}
      defaultValue={value?.toString()}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select day" />
      </SelectTrigger>
      <SelectContent>
        {days.map((day) => (
          <SelectItem key={day} value={day.toString()}>
            {day}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DayDropdownSelect;
