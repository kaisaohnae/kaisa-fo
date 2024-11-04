import React, {BaseSyntheticEvent, ForwardedRef, forwardRef, SyntheticEvent} from 'react';

interface InputPropsType {
  value: string;
  setValue: (value: string) => void;
  className?: string;
  maxLength?: number;
  trim?: boolean;
  time?: boolean;
  limiter?: (value: string) => string;
  placeholder?: string;
  disabled?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputPropsType>(
  (
    {
      className = 'basic-input w100',
      placeholder,
      value = '',
      setValue,
      maxLength,
      trim = true,
      time = false,
      limiter,
      disabled = false
    }: InputPropsType,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (limiter) {
        const limitedValue = limiter(e.target.value);
        setValue(limitedValue);
      } else {
        setValue(e.target.value);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (trim) {
        setValue(e.target.value.trim());
      }
      if (time) {
        setValue(e.target.value.padStart(2, '0'));
      }
    };

    return (
      <input
        ref={ref}
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        maxLength={maxLength}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
