import { useState } from 'react';

/**
 * Custom hook for handling form state and validation
 * @param initialValues - Initial form values
 * @returns Form state and handlers
 */
interface FormErrors {
  [key: string]: string;
}

export const useForm = <T extends Record<string, unknown>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  const setFieldValue = <K extends keyof T>(name: K, value: T[K]) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const setFieldError = (name: string, error: string) => {
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleChange,
    reset,
    setFieldValue,
    setFieldError,
  };
};

export default useForm;