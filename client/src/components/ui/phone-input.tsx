import PhoneInputWithCountry from "react-phone-number-input";
import type { Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: Country;
  placeholder?: string;
  className?: string;
  "data-testid"?: string;
}

export function PhoneInput({
  value,
  onChange,
  defaultCountry = "US",
  placeholder,
  className,
  "data-testid": testId,
}: PhoneInputProps) {
  return (
    <PhoneInputWithCountry
      international
      countryCallingCodeEditable={false}
      defaultCountry={defaultCountry}
      value={value}
      onChange={(val) => onChange(val || "")}
      placeholder={placeholder}
      className={cn("phone-input-wrapper", className)}
      data-testid={testId}
    />
  );
}

export default PhoneInput;
