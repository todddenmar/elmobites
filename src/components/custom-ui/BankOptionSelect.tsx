import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PHILIPPINES_BANKS } from "@/lib/config";
import { TPaymentMethod } from "@/typings";

type BankOptionSelectProps = {
  value: string;
  onChange: (value: TPaymentMethod) => void;
};

const BankOptionSelect: React.FC<BankOptionSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Bank" />
      </SelectTrigger>
      <SelectContent>
        {PHILIPPINES_BANKS.map((item, idx) => {
          return (
            <SelectItem key={`bank-item-${idx}`} value={item}>
              {item}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default BankOptionSelect;
