'use client'

import React from 'react'
import Navbar from './navbar'
import Calendar from './calender'
import Roomdetails from './roomdetails';


function page() {
  
  const examDate = new Date();

  return (
    <div>
      <Navbar/>
       <div className='lg:flex flex-row justify-center align-middle'  >

        <Calendar  date={examDate}   />
        <Roomdetails/>
       </div>
      
    </div>
   
  )
}

export default page