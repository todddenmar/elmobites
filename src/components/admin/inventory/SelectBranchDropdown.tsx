"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";

type SelectBranchDropdownProps = {
  value: string; // selected branch id (or "all")
  onChange: (value: string) => void;
  className?: string;
};

function SelectBranchDropdown({
  value,
  onChange,
  className,
}: SelectBranchDropdownProps) {
  const { currentStores } = useAppStore();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className ?? "w-[180px]"}>
        <SelectValue placeholder="Select branch" />
      </SelectTrigger>
      <SelectContent>
        {/* Option to show all */}
        <SelectItem value="all">All branches</SelectItem>

        {/* Store branches */}
        {currentStores?.map((store) => (
          <SelectItem key={store.id} value={store.id}>
            {store.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SelectBranchDropdown;
