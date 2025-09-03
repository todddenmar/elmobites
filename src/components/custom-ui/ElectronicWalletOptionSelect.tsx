import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TPaymentMethod } from "@/typings";
import { E_WALLETS } from "@/lib/config";

type ElectronicWalletOptionSelectProps = {
  value: string;
  onChange: (value: TPaymentMethod) => void;
};

const ElectronicWalletOptionSelect: React.FC<
  ElectronicWalletOptionSelectProps
> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select E-Wallet" />
      </SelectTrigger>
      <SelectContent>
        {E_WALLETS.map((item, idx) => {
          return (
            <SelectItem key={`e-wallet-item-${idx}`} value={item}>
              {item}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default ElectronicWalletOptionSelect;
