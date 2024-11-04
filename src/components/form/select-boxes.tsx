import React, {ChangeEvent} from 'react';

interface OptionType {
  [key: string]: string;
}

interface SelectBoxesPropsType {
  className?: string;
  value: any;
  setValue: (value: any) => void;
  options: OptionType[];
}

export default function SelectBoxes({
                                      className = 'basic-select w100',
                                      value,
                                      setValue,
                                      options
                                    }: SelectBoxesPropsType): React.JSX.Element {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  return (
    <select className={className} value={value} onChange={handleChange}>
      {options.map((option, index) => {
        const [key, label] = Object.entries(option)[0];
        return (
          <option key={index} value={key}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
