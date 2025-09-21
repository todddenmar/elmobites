"use client";

import { TEmployee } from "@/typings";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreVertical } from "lucide-react";
import UpdateEmployeeForm from "./forms/UpdateEmployeeForm";

type AdminEmployeeActionButtonProps = {
  employeeData: TEmployee;
};

function AdminEmployeeActionButton({
  employeeData,
}: AdminEmployeeActionButtonProps) {
  const [open, setOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setIsOpenEdit(true);
              setOpen(false);
            }}
          >
            Edit Employee
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpenEdit} onOpenChange={setIsOpenEdit}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              You can update the order&apos;s status here.
            </DialogDescription>
          </DialogHeader>
          <UpdateEmployeeForm
            employee={employeeData}
            setClose={() => setIsOpenEdit(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminEmployeeActionButton;
