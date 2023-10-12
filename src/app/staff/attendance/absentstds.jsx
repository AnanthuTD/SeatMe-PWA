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
								<p>ID : {student.id} </p>
								<p>Name : {student.name}</p>
								<p>Program : {student.program}</p>
								<span>
									{" "}
									Row : {student.row} col:{student.column}{" "}
								</span>
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