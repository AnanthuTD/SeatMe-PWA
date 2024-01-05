import React from 'react';
import { DatePicker as AntDatePicker } from 'antd'; // Importing DatePicker from antd with a different name
import dayjs from 'dayjs';

function CustomDatePicker({ onChange = () => { }, defaultValue, value }) {
    
    const disabledDate = (current) => {
        // Disable days before today
        return current && current <= dayjs().startOf('day');
    };

    return (
        <AntDatePicker
            style={{ width: 200 }}
            format="YYYY-MM-DD"
            className="date-picker"
            onChange={onChange}
            disabledDate={disabledDate}
            defaultValue={dayjs(defaultValue)}
            value={dayjs(value)}
        />
    );
}

export default CustomDatePicker;
