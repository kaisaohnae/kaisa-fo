import React, {ForwardedRef, forwardRef} from 'react';

interface TextareaProps {
  children?: React.ReactNode;
  className?: string;
  value: string;
  setValue: (value: string) => void;
  rows?: number;
  style?: React.CSSProperties;
  maxLength?: number;
  trim?: boolean;
  placeholder?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      children,
      className = 'basic-textarea',
      value,
      setValue,
      rows = 4,
      style = {minWidth: '100%', maxWidth: '100%'},
      maxLength,
      trim = false,
      placeholder
    }: TextareaProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (trim) {
        setValue(e.target.value.trim());
      }
    };

    return (
      <textarea
        ref={ref}
        className={className}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        style={style}
        maxLength={maxLength}
        rows={rows}
        placeholder={placeholder}
      >
        {children}
      </textarea>
    );
  }
);

Textarea.displayName = 'TextArea';

export default Textarea;
