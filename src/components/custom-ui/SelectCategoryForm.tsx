import { useAppStore } from "@/lib/store";
import { cn, getColor } from "@/lib/utils";
import React from "react";
import RaceCategoryIcon from "../custom-icons/RaceCategoryIcon";

function SelectCategoryForm({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const { currentRaceCategories, currentRacers } = useAppStore();
    const orderByOrderNumber =
      currentRaceCategories
        ?.filter((c) => !c.isArchived)
        ?.sort((a, b) => ((a.order || 1) < (b.order || 1) ? -1 : 1)) || [];
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => onChange("all")}
          className={cn(
            "w-full bg-white/5 flex justify-between px-4 py-2 rounded-lg text-sm font-semibold",
            value === "all" ? "border-[1px] border-white" : ""
          )}
        >
          <span>All</span>
          <span>{currentRacers?.length}</span>
        </button>
        {orderByOrderNumber.map((item) => {
          const isActive = item.id === value;
          const totalRacers = currentRacers?.filter(
            (racer) => racer.raceCategoryID === item.id
          );
          const cardTheme = item?.colorID ? getColor(item?.colorID) : null;
          return (
            <button
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "w-full bg-white/5  flex justify-between px-4 py-2 rounded-lg text-sm font-semibold",
                isActive ? "opacity-100" : "opacity-40"
              )}
              style={
                cardTheme
                  ? {
                      borderColor: isActive
                        ? cardTheme.backgroundColor
                        : "none",
                    }
                  : {}
              }
              key={`tab-category-${item.id}`}
              value={item.id}
            >
              <span className="flex items-center gap-2">
                <RaceCategoryIcon cardTheme={cardTheme} />
                <span>{item.name}</span>
              </span>
              <span>{totalRacers?.length}</span>
            </button>
          );
        })}
      </div>
    );
}

export default SelectCategoryForm;
