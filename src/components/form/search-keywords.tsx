import React, {ChangeEvent, ForwardedRef, forwardRef} from 'react';

interface SearchKeywordsPropsType {
  value: string;
  setValue: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
}

const SearchKeywords = forwardRef<HTMLInputElement, SearchKeywordsPropsType>(
  (
    {
      className = 'basic-input w100',
      placeholder = '복수의 키워드로 검색 시 (,)로 구분',
      value,
      setValue,
      onKeyDown
    }: SearchKeywordsPropsType,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    };

    const handleBlur = () => {
      if (value) {
        setValue(
          value
            .replace(/\s*,\s*/g, ',')
            .split(',')
            .join(', ')
        );
      }
    };

    return (
      <input
        type="text"
        value={value}
        className={className}
        ref={ref}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
      />
    );
  }
);
SearchKeywords.displayName = 'SearchKeywords';

export default SearchKeywords;
