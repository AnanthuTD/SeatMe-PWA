import React from "react";
import { Select } from "antd";

const { Option } = Select;

function TeacherSelector({ options, onChange, value }) {
  return (
    <Select
      showSearch
      style={{ width: "100%" }}
      placeholder="Select a teacher"
      optionFilterProp="children"
      onChange={onChange}
      value={value}
    >
      {options.map((option) => (
        <Option key={option.id} value={option.id}>
          {option.name}
        </Option>
      ))}
    </Select>
  );
}

export default TeacherSelector;
