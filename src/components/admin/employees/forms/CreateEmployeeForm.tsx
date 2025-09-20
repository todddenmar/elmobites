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
import { serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import SubmitLoadingButtons from "@/components/custom-ui/SubmitLoadingButtons";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { TEmployee, TSalaryType, TEmploymentStatus } from "@/typings";
import { dbSetDocument } from "@/lib/firebase/actions";

// --------------------
// Schema
// --------------------
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  positionID: z.string().min(1, "Position is required"),
  employmentStatus: z.enum(["ACTIVE", "INACTIVE", "TERMINATED"]),
  hireDate: z.string().min(1, "Hire date is required"),
  terminationDate: z.string().optional(),
  salaryType: z.enum(["FIXED", "HOURLY", "COMMISSION"]),
  salaryAmount: z.number().min(0, "Salary must be >= 0"),
  commissionRate: z.number().optional(),
  branchID: z.string().optional(), // 👈 added here
});

type CreateEmployeeFormProps = {
  setClose: () => void;
};

function CreateEmployeeForm({ setClose }: CreateEmployeeFormProps) {
  const {
    userData,
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
      firstName: "",
      lastName: "",
      positionID: "",
      employmentStatus: "ACTIVE" as TEmploymentStatus,
      hireDate: new Date().toISOString().split("T")[0], // default today
      salaryType: "FIXED" as TSalaryType,
      salaryAmount: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userData) {
      toast.error("User not logged in");
      return;
    }

    setIsLoading(true);

    const newEmployee: TEmployee = {
      id: crypto.randomUUID(),
      ...values,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await dbSetDocument({
      collectionName: DB_COLLECTION.EMPLOYEES,
      data: { ...newEmployee, timestamp: serverTimestamp() },
      id: newEmployee.id,
    });

    if (res.status === DB_METHOD_STATUS.ERROR) {
      toast.error("Error creating Employee");
      setIsLoading(false);
      return;
    }

    setCurrentEmployees([...(currentEmployees || []), newEmployee]);
    setIsLoading(false);
    setClose();
    toast.success("Employee created successfully");
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

          {/* Salary Type */}
          <FormField
            control={form.control}
            name="salaryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select salary type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FIXED">Fixed</SelectItem>
                      <SelectItem value="HOURLY">Hourly</SelectItem>
                      <SelectItem value="COMMISSION">Commission</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Salary Amount */}
          <FormField
            control={form.control}
            name="salaryAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Commission Rate (only if Commission) */}
          {form.watch("salaryType") === "COMMISSION" && (
            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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

export default CreateEmployeeForm;
