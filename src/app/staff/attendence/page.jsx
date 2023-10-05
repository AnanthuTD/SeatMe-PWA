'use client'

import React from 'react'
import Navbar from '../navbar'

function page() {
   const std = [
    {
        id: 14567,
        name : 'Muhammed',
        program : 'Bca',
        row:1,
        column:6,
    },
    {
        id: 14567,
        name : 'Muhammed',
        program : 'Bca',
        row:1,
        column:6,
    },
    {
        id: 14567,
        name : 'Muhammed',
        program : 'Bca',
        row:1,
        column:6,
    },
    {
        id: 14567,
        name : 'Muhammed',
        program : 'Bca',
        row:1,
        column:6,
    },
    {
        id: 14567,
        name : 'Muhammed',
        program : 'Bca',
        row:1,
        column:6,
    },
    {
        id: 14567,
        name : 'Muhammed',
        program : 'Bca',
        row:1,
        column:6,
    },
    {
        id: 14567,
        name : 'Muhammed',
        program : 'Bca',
        row:1,
        column:6,
    },
    {
        id: 14567,
        name : 'Muhammed',
        program : 'Bca',
        row:1,
        column:6,
    },
    {
        id: 14567,
        name : 'Muhammed',
        program : 'Bca',
        row:1,
        column:6,
    },
    {
        id: 14567,
        name : 'Muhammed',
        program : 'Bca',
        row:1,
        column:6,
    },

   ]


  return (
    <>
        <Navbar/>
        <div className='flex lg:flex-row gap-4  sm:flex-col lg:mt-14 flex-wrap sm:mt-8'  >
           {
            std.map((student)=> (
            <div className='bg-green-500 m-4 p-2 rounded-lg'  >  <p>ID : {student.id} </p> 
              <div className='flex flex-row align-middle  justify-between'  >
              <div>
               <p>Name : {student.name}</p>
               <p>Program : {student.program}</p>
               <span> Row : {student.row} col:{student.column} </span>
              </div>
              <button>Absent</button>
              </div>
             
             </div>
            ))
           }
             
        </div>



    </>
  )
}

export default page