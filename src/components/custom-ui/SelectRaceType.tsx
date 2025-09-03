import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type SelectRaceTypeProps = {
  value: string;
  setValue: (val: string) => void;
  options: { value: string; label: string }[];
  name: string;
};
function SelectRaceType({
  value,
  setValue,
  options,
  name,
}: SelectRaceTypeProps) {
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((item, idx) => {
          return (
            <SelectItem key={`${name}-option-item-${idx}`} value={item.value}>
              {item.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export default SelectRaceType;
