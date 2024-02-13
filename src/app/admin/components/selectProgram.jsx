// SelectProgram.js
import React from 'react';
import { Select } from 'antd';

const SelectProgram = ({ options, placeholder, onChange, value }) => {
  return (
    <Select
      showSearch
      placeholder={placeholder}
      optionFilterProp="label"
      onChange={onChange}
      value={value}
      filterOption={(input, option) =>
        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {options.map((program) => (
        <Select.Option key={program.id} value={program.id} label={program.name}>
          {program.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectProgram;
