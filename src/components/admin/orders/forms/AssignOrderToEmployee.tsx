"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppStore } from "@/lib/store";
import { dbUpdateDocument } from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { toast } from "sonner";

type AssignOrderToEmployeeProps = {
  employeeID: string | null;
  orderID: string;
};
export function AssignOrderToEmployee({
  employeeID,
  orderID,
}: AssignOrderToEmployeeProps) {
  const { currentEmployees } = useAppStore();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(employeeID || "");
  const employeeOptions = currentEmployees.map((item) => ({
    value: item.id,
    label: `${item.firstName} ${item.lastName}`,
  }));

  const onAssignEmployee = async (id: string) => {
    const employeeFound = currentEmployees.find((item) => item.id === id);
    const res = await dbUpdateDocument(DB_COLLECTION.ORDERS, orderID, {
      assignedEmployeeName: `${employeeFound?.firstName} ${employeeFound?.lastName}`,
      assignedEmployeeID: id,
    });
    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.log(res.message);
      return;
    }
    toast.success("Employee assigned successfully!");
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? employeeOptions.find((employee) => employee.value === value)
                ?.label
            : "Assign employee..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {employeeOptions.map((employee) => (
                <CommandItem
                  key={employee.value}
                  value={employee.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onAssignEmployee(employee.value);
                    setOpen(false);
                  }}
                >
                  {employee.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === employee.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
