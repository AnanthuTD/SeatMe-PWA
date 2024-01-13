import React from 'react';
import { Card, Descriptions } from 'antd';

const ProgramCountsDisplay = ({ totalCounts }) => {
    return (
        // <Card title="Program Counts">
            <Descriptions column={1} bordered title="Program Counts">
                {Object.entries(totalCounts).map(([programId, count]) => (
                    <Descriptions.Item key={programId} label={`${programId}`}>
                        {count}
                    </Descriptions.Item>
                ))}
            </Descriptions>
        // </Card>
    );
};

export default ProgramCountsDisplay;
