'use client';

import { Search, X } from 'lucide-react';
import { Input } from '../ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, onDelete, placeholder, className }: SearchBarProps) {
  return (
    <div className={`relative flex-1 md:min-w-80 w-full ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        name="search"
        placeholder={placeholder}
        className="pl-10 h-11 border-gray-200 focus:ring-galaxy-blue"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={onDelete}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}
