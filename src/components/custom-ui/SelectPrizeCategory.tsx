import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TPrizeCategory } from "@/typings";
type SelectPrizeCategoryProps = {
  prizeCategories: TPrizeCategory[];
  onChange: (val: TPrizeCategory | null) => void;
};
function SelectPrizeCategory({
  prizeCategories,
  onChange,
}: SelectPrizeCategoryProps) {
  const [selectedID, setSelectedID] = useState<string>("overall");
  useEffect(() => {
    const selectedPrizeCategory = prizeCategories.find(
      (item) => item.id === selectedID
    );
    onChange(selectedPrizeCategory || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedID]);
  return (
    <div>
      <Select value={selectedID} onValueChange={setSelectedID}>
        <SelectTrigger className="max-w-sm">
          <SelectValue placeholder="Overall" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"overall"}>Overall</SelectItem>
          {prizeCategories.map((item) => {
            return (
              <SelectItem
                key={`select-prize-category-${item.id}`}
                value={item.id}
              >
                {item.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectPrizeCategory;
