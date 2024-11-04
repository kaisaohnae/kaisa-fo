import {ChangeEvent, Fragment, useEffect, useState} from 'react';
import axiosInstance from '@/config/axios-global-setting';
import {SERVER_URL} from '@/etc/constant';

interface RadioButtonsByCodeProps {
  className?: string;
  code: string;
  value: string;
  emptyValue?: { label: string; value: string };
  setValue: (value: string) => void;
  excludeCodeValues?: string[];
}

interface CodeItemType {
  codeKey: string;
  codeValue: string;
}

export default function SelectBoxesByCode({
                                            className = 'basic-select w100',
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
  }, [code, excludeCodeValues]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  return (
    <>
      <select className={className} value={value} onChange={handleChange}>
        {emptyValue && <option value={emptyValue.value}>{emptyValue.label}</option>}
        {codeItems.map(item => (
          <option key={item.codeKey} value={item.codeKey}>
            {item.codeValue}
          </option>
        ))}
      </select>
    </>
  );
}
