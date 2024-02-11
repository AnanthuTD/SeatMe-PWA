import * as React from "react";
import { IoMdHome } from "react-icons/io";
import { MdOutlineEventSeat } from "react-icons/md";

/*  <IoMdHome  className='h-11 w-11' />  */

export default function studentnav() {
	return (
		<>
			<div className=" navhead_title  h-12 p-1  w-full  bg-blue-700  flex flex-row items-center justify-center gap-2 ">
				<MdOutlineEventSeat className="h-11 w-11" />
				<h3 className="text-white  m-0 mt-2 text-3xl">Seatme</h3>
			</div>
		</>
	);
}
