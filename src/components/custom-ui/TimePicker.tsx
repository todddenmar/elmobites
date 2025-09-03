"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OPTIONS_HOUR, OPTIONS_MINUTE } from "@/lib/config";
import { TPeriod } from "@/typings";
type TimePickerProps = {
  hour: string;
  setHour: (val: string) => void;
  minute: string;
  setMinute: (val: string) => void;
  period: TPeriod;
  setPeriod: (val: TPeriod) => void;
};
function TimePicker({
  hour,
  setHour,
  minute,
  setMinute,
  period,
  setPeriod,
}: TimePickerProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Select value={hour} onValueChange={setHour}>
        <SelectTrigger className="w-full flex-1">
          <SelectValue placeholder="Select Hour" />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS_HOUR.map((item, idx) => {
            return (
              <SelectItem key={`hour-item-${idx}`} value={item.value}>
                {item.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Select value={minute} onValueChange={setMinute}>
        <SelectTrigger className="w-full flex-1">
          <SelectValue placeholder="Select Minute" />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS_MINUTE.map((item, idx) => {
            return (
              <SelectItem key={`minute-item-${idx}`} value={item.value}>
                {item.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Select value={period} onValueChange={setPeriod}>
        <SelectTrigger>
          <SelectValue placeholder="Select Period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default TimePicker;
