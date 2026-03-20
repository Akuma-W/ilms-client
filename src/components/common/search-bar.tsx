import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder
}: SearchBarProps) {
  return (
    <div className="relative flex-1 md:w-80">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        placeholder={placeholder}
        className="pl-10 h-11 border-gray-200 focus:ring-galaxy-blue"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
