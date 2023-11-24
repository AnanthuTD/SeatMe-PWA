import React from "react";
import { FileTextOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";

function Instruction() {
	return (
		<>  

                   


			<div>
				<h1 className="text-sm  align-middle lg:text-xl text-red-500 ">
					Instructions to the Students(University Examinations)
				</h1>
				<p>
					Read all the instructions and rules given in the hall ticket
					before entering the exam hall. Especially instructions:
					6,7,9,10 &12 <br /> <br />
					• Students are not allowed to write anything on their hall
					ticket or question paper. If written it will be considered
					as malpractice. <br /> <br />
					(But write the name and register number on the question
					paper compulsorily - only in the space provided). <br />{" "}
					<br />
					If anyone wants to do the rough work, the last page of the
					main book can be used for rough work. Write Rough Work at
					the top of the page. After use of the page, strike off.{" "}
					<br /> <br />
					• Students should be present in the examination hall at
					least before 1.20 pm (1.50 pm on Fridays) for the afternoon
					examination. Students appearing after 1.30 p.m will not be
					admitted to the examination hall. <br /> <br />
					• Nothing is allowed to be brought in the examination hall
					except hall ticket, pens, pencils and scale. If a student is
					found to be in possession of any type of electronic device,
					it will be confiscated and considered a malpractice. <br />{" "}
					<br />
					Standard calculators, which are only allowed for certain
					subjects, may be used. <br /> <br />
					• Only students with full uniform, ID card and hall ticket
					will be allowed to appear for the exam. Uniform should be as
					per college rules. <br /> <br />
				</p>
				<h5 className="ml-24"> Chief Superintendent / Principal </h5>
			</div>
		</>
	);
}

export default Instruction;
