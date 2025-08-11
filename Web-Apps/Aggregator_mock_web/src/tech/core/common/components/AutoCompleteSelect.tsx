import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface AutocompleteSelectProps {
  placeholder?: string;
  options: { [key: string]: any }[]; // Updated options type to an array of objects
  value?: string | undefined;
  valueSno?: string | undefined;
  name?: string | undefined;
  onChange: (value: string) => void;
}

const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({
  placeholder,
  options,
  value,
  onChange,
  valueSno,
  name,
}) => {
  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      filterOption={(input, option: any) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      size="large"
    >
      {options.map(option => (
        <Option key={option[valueSno || '']} value={option[valueSno || '']}>
          {option[name || '']}
        </Option>
      ))}
    </Select>
  );
};

export default AutocompleteSelect;
