import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TGender } from "@/typings";

type GenderDropdownSelectProps = {
  value: string | undefined;
  onChange: (value: TGender) => void;
  withAll?: boolean;
  isFemaleOnly?: boolean;
  isMaleOnly?: boolean;
};

const GenderDropdownSelect: React.FC<GenderDropdownSelectProps> = ({
  value,
  onChange,
  withAll,
  isFemaleOnly,
  isMaleOnly,
}) => {
  const renderContent = () => {
    if (isFemaleOnly) {
      return (
        <SelectContent>
          {withAll && <SelectItem value="all">All</SelectItem>}
          <SelectItem value="female">Female</SelectItem>
        </SelectContent>
      );
    }
    if (isMaleOnly) {
      return (
        <SelectContent>
          {withAll && <SelectItem value="all">All</SelectItem>}
          <SelectItem value="male">Male</SelectItem>
        </SelectContent>
      );
    }
    return (
      <SelectContent>
        {withAll && <SelectItem value="all">All</SelectItem>}
        <SelectItem value="male">Male</SelectItem>
        <SelectItem value="female">Female</SelectItem>
      </SelectContent>
    );
  };
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue
          placeholder={
            isFemaleOnly || isMaleOnly ? "Confirm Gender" : "Select Gender"
          }
        />
      </SelectTrigger>
      {renderContent()}
    </Select>
  );
};

export default GenderDropdownSelect;
