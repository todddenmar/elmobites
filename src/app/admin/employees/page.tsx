"use client";
import { AdminEmployeeTable } from "@/components/admin/employees/AdminEmployeeTable";
import EmployeeCreateButton from "@/components/admin/employees/EmployeeCreateButton";
import PositionCreateButton from "@/components/admin/employees/PositionCreateButton";
import SectionTitle from "@/components/custom-ui/SectionTitle";
import { useAppStore } from "@/lib/store";
import React from "react";

function AdminEmployeesPage() {
  const { currentSettings, currentEmployees } = useAppStore();
  return (
    <div className="flex flex-col gap-4 flex-1 h-full bg-white p-4 rounded-lg">
      <div className="grid grid-cols-1 gap-4 lg:flex justify-between items-center w-full">
        <SectionTitle>Employees</SectionTitle>

        <div className="flex justify-between gap-4">
          <PositionCreateButton />
          {currentSettings.employeePositions?.length > 0 ? (
            <EmployeeCreateButton />
          ) : null}
        </div>
      </div>
      <div className="flex-1 grid">
        <AdminEmployeeTable
          employees={currentEmployees.map((item) => ({
            ...item,
            position: currentSettings.employeePositions.find(
              (e) => e.id === item.positionID
            ),
          }))}
        />
      </div>
    </div>
  );
}

export default AdminEmployeesPage;
