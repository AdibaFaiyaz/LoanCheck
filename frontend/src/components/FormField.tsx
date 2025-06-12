import React from 'react';
import type { IconType } from 'react-icons';

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  icon?: IconType;
  required?: boolean;
  min?: number;
  max?: number;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  icon: Icon,
  required,
  min,
  max,
  className = ''
}) => {
  return (
    <div className={className}>
      <label className="block text-lg font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`flex items-center border rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500 ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-300'
      }`}>
        {Icon && <Icon className="text-gray-500 mr-2" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="w-full outline-none text-black bg-transparent"
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-fade-in-down">{error}</p>
      )}
    </div>
  );
};