"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import SubmitLoadingButtons from "@/components/custom-ui/SubmitLoadingButtons";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { TEmployee, TEmploymentStatus } from "@/typings";
import { dbUpdateDocument } from "@/lib/firebase/actions";

// --------------------
// Schema
// --------------------
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email().optional(),
  mobileNumber: z.string().optional(),
  positionID: z.string().min(1, "Position is required"),
  employmentStatus: z.enum(["ACTIVE", "INACTIVE", "TERMINATED"]),
  branchID: z.string().optional(),
});

type UpdateEmployeeFormProps = {
  setClose: () => void;
  employee: TEmployee;
};

function UpdateEmployeeForm({ setClose, employee }: UpdateEmployeeFormProps) {
  const {
    currentEmployees,
    setCurrentEmployees,
    currentStores,
    currentSettings,
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const positions = currentSettings.employeePositions;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email || "",
      mobileNumber: employee.mobileNumber || "",
      positionID: employee.positionID,
      employmentStatus: employee.employmentStatus as TEmploymentStatus,
      branchID: employee.branchID || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });
    setIsLoading(true);

    const updatedEmployee: TEmployee = {
      ...employee,
      ...values,
      updatedAt: new Date().toISOString(),
    };

    const res = await dbUpdateDocument(DB_COLLECTION.EMPLOYEES, employee.id, {
      ...updatedEmployee,
    });

    if (res.status === DB_METHOD_STATUS.ERROR) {
      toast.error("Error updating Employee");
      setIsLoading(false);
      return;
    }

    // update Zustand state
    const updatedList = (currentEmployees || []).map((emp) =>
      emp.id === employee.id ? updatedEmployee : emp
    );
    setCurrentEmployees(updatedList);

    setIsLoading(false);
    setClose();
    toast.success("Employee updated successfully");
  }

  // --------------------
  // Render
  // --------------------
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="overflow-y-auto h-[500px] md:h-fit px-2 space-y-4">
          {/* Branch / Store Selection */}
          <FormField
            control={form.control}
            name="branchID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch / Store</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentStores?.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter mobile number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email address"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Position */}
          <FormField
            control={form.control}
            name="positionID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions?.map((pos) => (
                        <SelectItem key={pos.id} value={pos.id}>
                          {pos.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Employment Status */}
          <FormField
            control={form.control}
            name="employmentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Status</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="TERMINATED">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <SubmitLoadingButtons
            onSubmit={form.handleSubmit(onSubmit)}
            setClose={setClose}
            isLoading={isLoading}
          />
        </div>
      </form>
    </Form>
  );
}

export default UpdateEmployeeForm;
