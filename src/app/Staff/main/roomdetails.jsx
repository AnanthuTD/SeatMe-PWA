'use client'

import React from 'react';
/*import { Descriptions } from 'antd';


/*const items = [
    {
        label: 'Building',
        children: 'South Block',
    },
    {
        label: 'Floor Number',
        children: '1st Floor',
    },
    {
        label: 'Room Number',
        children: '704',
    },
    {
        label: 'Row Number',
        // span: { xl: 2, xxl: 2 },
        children: '5',
    },
    {
        label: 'Seat Number',
        // span: { xl: 2, xxl: 2 },
        children: '15',
    },
];
*/





function Roomdetails() {

  return (

    /*

    <Descriptions
        // title="Responsive Descriptions"
        bordered
        column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        items={items}
    />
    */ 
   
        <table className='p-8 border-2' >
        <tr>
            <th>Exam Name</th>
            <td>Internal Exam UG</td>        
         </tr>   
         <tr>
            <th>Building</th>
            <td>South Block</td>
         </tr>
         <tr>
            <th>Floor Number</th>
            <td>1st Floor</td>
         </tr>
         <tr>
            <th>Room Number</th>
            <td>704</td>
         </tr>
        </table>

  )
}

export default Roomdetails