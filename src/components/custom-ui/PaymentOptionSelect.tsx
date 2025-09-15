import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TPaymentMethod } from "@/typings";
import { PAYMENT_OPTIONS } from "@/lib/config";

type PaymentOptionSelectProps = {
  value: string;
  onChange: (value: TPaymentMethod) => void;
};

const PaymentOptionSelect: React.FC<PaymentOptionSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Payment Option" />
      </SelectTrigger>
      <SelectContent>
        {PAYMENT_OPTIONS.map((item) => {
          return (
            <SelectItem key={`payment-option-item-${item.id}`} value={item.id}>
              {item.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default PaymentOptionSelect;
