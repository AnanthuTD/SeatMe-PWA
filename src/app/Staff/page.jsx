'use client';

import React from 'react';
import Navbar from './navbar';
import Calendar from './calender';
import RoomDetails from './roomDetails';

function page() {
    const onDuty= true;

    return (
        <div>
            <Navbar />
           
             { onDuty ?  (
                 <div className="lg:flex flex-row gap-3 justify-center align-middle">
                 <Calendar />
                 <RoomDetails  />  
                 </div>
             
             ) : ( <div>hi</div> )  }    
                    
        
                
            
        </div>
    );
}

export default page;
