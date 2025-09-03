import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TPaymentMethod } from "@/typings";
import { PAYMENT_OPTION, PAYMENT_OPTIONS } from "@/lib/config";

type PaymentOptionSelectProps = {
  value: string;
  onChange: (value: TPaymentMethod) => void;
  isOrganizer?: boolean;
};

const PaymentOptionSelect: React.FC<PaymentOptionSelectProps> = ({
  value,
  onChange,
  isOrganizer,
}) => {
  const paymentOptions = isOrganizer
    ? PAYMENT_OPTIONS
    : PAYMENT_OPTIONS.filter((item) => item.id != PAYMENT_OPTION.CASH.id);
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Gender" />
      </SelectTrigger>
      <SelectContent>
        {paymentOptions.map((item) => {
          return (
            <SelectItem key={`gender-item-${item.id}`} value={item.id}>
              {item.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default PaymentOptionSelect;
