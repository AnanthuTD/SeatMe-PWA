import React from 'react'

function absentstds({data}) {

  const absentees = data.filter(std => !std.isPresent)
  

  return (
   
      <>
      <div>
      {absentees.map((student) => (
					<div
						className={` m-4 p-2 rounded-lg ${
							student.isPresent ? "bg-green-500" : "bg-red-500"
						}`}
					>
						
							<div className="text-blue-800">
								<p>ID : {student.id} </p>
								<p>Name : {student.name}</p>
								<p>Program : {student.program}</p>
								<span>
									{" "}
									Row : {student.row} col:{student.column}{" "}
								</span>
							</div>
							
						
					</div>
				))}
      </div>
            
      </>
    
    
  )
}

export default absentstds;