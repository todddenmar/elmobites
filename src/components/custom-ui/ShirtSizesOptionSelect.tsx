import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SHIRT_SIZES } from "@/lib/config";

type ShirtSizesOptionSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

const ShirtSizesOptionSelect: React.FC<ShirtSizesOptionSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Gender" />
      </SelectTrigger>
      <SelectContent>
        {SHIRT_SIZES.map((item) => {
          return (
            <SelectItem key={`${item}`} value={item}>
              {item}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default ShirtSizesOptionSelect;
