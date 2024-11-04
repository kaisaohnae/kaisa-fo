import {ChangeEvent, Fragment, useEffect, useState} from 'react';
import axiosInstance from '@/config/axios-global-setting';
import {SERVER_URL} from '@/etc/constant';

interface RadioButtonsByCodeProps {
  className?: string;
  code?: string;
  value: string;
  emptyValue?: { label: string; value: string };
  setValue: (value: string) => void;
  excludeCodeValues?: [string];
}

interface CodeItemType {
  codeKey: string;
  codeValue: string;
}

export default function RadioButtonsByCode({
                                             className = 'basic-radio',
                                             code,
                                             value,
                                             emptyValue,
                                             setValue,
                                             excludeCodeValues
                                           }: RadioButtonsByCodeProps) {
  const [codeItems, setCodeItems] = useState<CodeItemType[]>([]);

  useEffect(() => {
    axiosInstance
      .get(SERVER_URL.API + `adm/system/code-items?code=${code}`)
      .then(({data: response}: { data: JsonResponseType }) => {
        if (!response.success) {
          alert(response.message);
          return;
        }
        let newList: CodeItemType[] = response.list;
        if (excludeCodeValues) {
          newList = newList.filter(code => {
            return !excludeCodeValues.includes(code.codeValue);
          });
        }
        setCodeItems(newList);
      })
      .catch(console.error);
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <>
      {emptyValue && (
        <>
          <label>
            &nbsp;
            <input
              type="radio"
              className={className}
              value={emptyValue.value}
              checked={value === emptyValue.value}
              onChange={handleChange}
            />
            &nbsp;{emptyValue.label}
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </>
      )}
      {codeItems.map(item => (
        <Fragment key={item.codeKey}>
          <label>
            <input
              type="radio"
              className={className}
              value={item.codeKey}
              checked={value === item.codeKey}
              onChange={handleChange}
            />
            &nbsp;{item.codeValue}
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </Fragment>
      ))}
    </>
  );
}
