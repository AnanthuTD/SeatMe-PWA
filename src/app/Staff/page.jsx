'use client';

import React from 'react';
import Navbar from './navbar';
import Calendar from './calender';
import RoomDetails from './roomDetails';
import Offduty from './offduty';

function page() {
    const onDuty= false;

    return (
        <div>
            <Navbar />
           
             { onDuty ?  (
                 <div className="lg:flex flex-row gap-3 justify-center align-middle">
                 <Calendar />
                 <RoomDetails  />  
                 </div>
             
             ) : ( <Offduty/> )  }    
                    
        
                
            
        </div>
    );
}

export default page;
