import React from 'react'

function absentstds({data}) {

  const absentees = data.filter(std => !std.isPresent)
  

  return (
   
      <>
      <div>
      {  absentees.length ? 
      absentees.map((student) => (
					<div
						className={` m-4 p-2 rounded-lg ${
							student.isPresent ? "bg-green-800" : "bg-red-800"
						}`}
					>
						
							<div className="text-white font-serif ">
							<p>RegNo: {student.student.id}</p>
                            <p>RollNo: {student.student.roll_number}</p>
                            <p>Name: {student.student.name}</p>
                            <p>SeatNumber: {student.seatNumber}</p>
                            <p>Program: {student.exam.course.programCourses[0].program.name}</p>
		                    <p> Course: {student.exam.course.name} </p>
							</div>
							
						
					</div>
				)) :
                    <div className='text-center text-green-800 text-3xl  mt-10 font-mono '  >  All are Present !! </div>
                    }
      </div>
            
      </>
    
    
  )
}

export default absentstds;