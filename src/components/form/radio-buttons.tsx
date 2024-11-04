import {ChangeEvent, Fragment} from 'react';

interface RadioButtonsProps {
  className?: string;
  options: RadioInputType[];
  value: any;
  setValue: (value: any) => void;
  disabled?: boolean
}

interface RadioInputType {
  [key: string]: string;
}

export default function RadioButtons({
                                       className = 'basic-radio',
                                       options,
                                       value,
                                       setValue,
                                       disabled = false
                                     }: RadioButtonsProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <>
      {options.map((option, index) => {
        const [key, label] = Object.entries(option)[0];
        return (
          <Fragment key={key}>
            <label>
              <input
                type="radio"
                className={className}
                value={key}
                checked={value === key}
                onChange={handleChange}
                disabled={disabled}
              />
              &nbsp;{label}
            </label>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </Fragment>
        );
      })}
    </>
  );
}
