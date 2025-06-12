import React from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FieldValidation {
  [key: string]: ValidationRule;
}

export const useFormValidation = (rules: FieldValidation) => {
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: any): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${name} is required`;
    }

    if (rule.minLength && value.toString().length < rule.minLength) {
      return `${name} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value.toString().length > rule.maxLength) {
      return `${name} must be no more than ${rule.maxLength} characters`;
    }

    if (rule.min && Number(value) < rule.min) {
      return `${name} must be at least ${rule.min}`;
    }

    if (rule.max && Number(value) > rule.max) {
      return `${name} must be no more than ${rule.max}`;
    }

    if (rule.pattern && !rule.pattern.test(value.toString())) {
      return `${name} format is invalid`;
    }

    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  };

  const validate = (formData: { [key: string]: any }): boolean => {
    const newErrors: { [key: string]: string } = {};

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSingle = (name: string, value: any) => {
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  };

  const clearErrors = () => setErrors({});

  return { errors, validate, validateSingle, clearErrors };
};