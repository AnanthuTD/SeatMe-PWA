import React, { useState } from "react";
import { IoInformationCircleSharp } from "react-icons/io5";
import { MdGTranslate } from "react-icons/md";

function Instruction() {
	const [translate, setTranslate] = useState(false);
	const [displayInfo, setDisplayInfo] = useState(true);

	const translator = () => {
		setTranslate(!translate);
		// console.log(translate);
	};

	const showInfo = () => {
		setDisplayInfo(!displayInfo);
	};

	return (
		<>
			{displayInfo ? (
				<button
					className=" p-2 border-none bg-blue-700 text-white  rounded-md flex gap-2 text-sm"
					onClick={translator}
				>
					<MdGTranslate />
					Translate
				</button>
			) : null}

			{displayInfo ? (
				translate ? (
					<div className="p-3">
						<h1 className="  align-middle lg:text-xl text-red-500 text-sm ">
							യൂണിവേഴ്സിറ്റി പരീക്ഷ എഴുതുന്ന വിദ്യാർത്ഥികൾക്കുള്ള
							നിർവേശങ്ങൾ.
						</h1>
						<ul className="list-disc sm:text-xs">
							ഹാൾ ടിക്കറ്റിൽ നൽകിയിരിക്കുന്ന എല്ലാ നിർദ്ദേശങ്ങള ും
							നിയമങ്ങള ും പരീക്ഷാ ഹാളിൽ കയറുന്നതിന മുൻപ വായിക്കുക.
							പ്രദ്ദയേകിച്ച് നിർദ്ദേശങ്ങൾ : 6,7,9,10 &12 <br /> <br />
							• വിദ്യാർത്ഥികൾക്ക് അവരുടെ ഹാൾ െിക്കറ്റില ാ ല ാദ്യലേപ്പറില
							ാ ഒന്ുുംഎഴുതാൻ അനുവാദ്മില്ല. എഴുതിയാൽ മാൽപ്ോക്റ്റിസായി
							കണക്കാക്കുും. <br /> <br />
							(എന്ാൽ ല ാദ്യലേപ്പറിൽ ലേരുും രജിസ്റ്റർ നമ്പറുും
							നിർബന്ധമായുും എഴുതുക - എഴുതുവാൻ നൽകിയിരിക്കുന്സ്ഥ
							ത്ത്മാപ്തും). <br /> <br />
							ആർടക്കങ്കി ുും റഫ്വർക്ക്ട യ്യ്തു നനാക്കണമമന്നുമെങ്കിൽ,
							പ്രധാന േുസ്കത ത്തി ടെ അവസാന ലേജ്റഫ്വർക്കിനായി
							ഉേലയാഗിക്കാും. ലേജിന്മുകളിൽ റഫ്വർക്ക്എടന്ഴുതുക.
							ഉേലയാഗത്തിന്ലേഷും, സ്്പ്െക്ക്ഓഫ്ട യ്യുക(ടവട്ടികളയുക).{" "}
							<br /> <br />
							• വിദ്യാർത്ഥികൾ ഉച്ചയ്ക്കുള്ള പരീക്ഷയ്ക്ക് , 1.20 p m ന് (
							വവള്ളിയ്കാഴ്കച ളിൽ ഉച്ചയ്ക്ക് 1.50 ന് ) മുവെങ്കിലുും
							പരീക്ഷാ ഹാളിൽ ഹാജരാവകണ്ടതാണ്. 1.30 p m ന് ശേഷും ഹാജരാകുന്ന
							വിദ്യാർത്ഥികവള പരീക്ഷാ ഹാളിൽ പ്പശവേിപ്പികില്ല. <br />{" "}
							<br />
							• േരീക്ഷഹാളിൽ, ഹാൾ ടിക്കറ്റ്, ലേനകൾ ടേൻസി ുകൾ സ്ടകയിൽ
							ഇവടയാഴിടക മടറ്റാന്ുും ടകാണ്ടുവരാൻ അനുവാദ്മില്ല. ഏതെങ്കില ും
							െരത്തില ള്ളഇലക്ട്രോണിക്ഉപകരണങ്ങൾ വിദ്യോർത്ഥിയ തരകകവശും
							ഉതെന്ന്കതെത്തിയോൽ, അെ്കെ തകട്ട കയ ും മോൽ്പോക്റിസോയി
							കണക്കോക്ക കയ ും തെയ് ും. <br /> <br />
							ി പ്േലതയക വിഷയങ്ങൾക്ക്മാപ്തുംഅനുവദനീയമായ സാധാരണ
							കാൽക്കുദ്ദല്റ്ററുകൾ , ഉേലയാഗിക്കാും .. <br /> <br />
							• മ ഴ വൻ യൂണിട ോമ ുംഐഡി കോർഡ ും ഹോൾ രിക്കറ ും
							ഉള്ളവിദ്യോർത്ഥികതെ മോ്െടമ പരീക്ഷഎഴ െ വോന ള്ളഅന വോദ്ും
							ഉെോയിരിക്ക കയ ള്ളൂ. ടകോടെജ് െട്ടങ്ങൾഅന സരിച്ച
							ള്ളെോയിരിക്കണും <br /> <br />
						</ul>
						<h5 className="ml-24">
							{" "}
							- Chief Superintendent / Principal{" "}
						</h5>
					</div>
				) : (
					<div className="p-3">
						<h1 className="  align-middle lg:text-xl text-red-500 text-sm ">
							Instructions to the Students(University Examinations)
						</h1>
						<p className="sm:text-xs ">
							Read all the instructions and rules given in the hall
							ticket before entering the exam hall. Especially
							instructions: 6,7,9,10 &12 <br /> <br />
							• Students are not allowed to write anything on their hall
							ticket or question paper. If written it will be considered
							as malpractice. <br /> <br />
							(But write the name and register number on the question
							paper compulsorily - only in the space provided). <br />{" "}
							<br />
							If anyone wants to do the rough work, the last page of the
							main book can be used for rough work. Write Rough Work at
							the top of the page. After use of the page, strike off.{" "}
							<br /> <br />• Students should be present in the
							examination hall at least before 1.20 pm (1.50 pm on
							Fridays) for the afternoon examination. Students appearing
							after 1.30 p.m will not be admitted to the examination
							hall. <br /> <br />
							• Nothing is allowed to be brought in the examination hall
							except hall ticket, pens, pencils and scale. If a student
							is found to be in possession of any type of electronic
							device, it will be confiscated and considered a
							malpractice. <br /> <br />
							Standard calculators, which are only allowed for certain
							subjects, may be used. <br /> <br />
							• Only students with full uniform, ID card and hall ticket
							will be allowed to appear for the exam. Uniform should be
							as per college rules. <br /> <br />
						</p>
						<h5 className="ml-24">
							{" "}
							- Chief Superintendent / Principal{" "}
						</h5>
					</div>
				)
			) : null}
		</>
	);
}

export default Instruction;
