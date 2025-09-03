import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TRacePackage } from "@/typings";
import { convertCurrency } from "@/lib/utils";
type SelectCategoryPackageProps = {
  racePackages: TRacePackage[];
  onChange: (val: TRacePackage | undefined) => void;
};
function SelectCategoryPackage({
  racePackages,
  onChange,
}: SelectCategoryPackageProps) {
  const [selectedID, setSelectedID] = useState<string>("overall");
  useEffect(() => {
    const selectedPackage = racePackages.find((item) => item.id === selectedID);
    onChange(selectedPackage || undefined);
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
          {racePackages.map((item) => {
            return (
              <SelectItem
                key={`select-prize-category-${item.id}`}
                value={item.id}
              >
                <span>{item.name}</span>
                {" - "}
                <span className="text-muted-foreground">
                  {convertCurrency(item.price)}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectCategoryPackage;
