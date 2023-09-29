'use client';

import React from 'react';

function calender(props) {
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const d = new Date();

    /*document.write("The current month is " + monthNames[d.getMonth()]); */
    return (
        <div className=" lg:mt-20 w-80   p-5 sm:m-5 lg:ml-52 ">
            <div className="flex flex-col  content-center ml-5  gap-3">
                <h1 className="font-bold text-red-800 text-3xl   ">
                    Duty Shedulded{' '}
                </h1>
                <span className="      text-8xl ">{d.getDate()}</span>
                <p className="  text-lg  ">
                    {' '}
                    {monthNames[d.getMonth()]}-{d.getFullYear()}{' '}
                </p>
                <p className="  text-lg ">Time:AfterNoon</p>
            </div>
        </div>
    );
}

export default calender;
