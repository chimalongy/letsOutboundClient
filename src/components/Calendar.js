// Calendar.js
import React, { useState } from 'react';
import '../styles/Calendar.css';


const Calendar = () => {
    const currentDate = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const numberOfDaysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = Array.from({ length: numberOfDaysInMonth }, (_, index) => index + 1);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Calculate the number of days to render from the previous month
    //const daysFromPrevMonth = (firstDayOfWeek - 1 + 7) % 7;
    const daysFromPrevMonth = firstDayOfWeek;




    const nextMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth + 1) % 12);
        setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear));
    };

    // Function to handle previous month button click
    const prevMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
        setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear));
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={prevMonth}>Previous Month</button>
                <span>{`${currentYear} - ${currentMonth + 1}`}</span>
                <button onClick={nextMonth}>Next Month</button>
            </div>
            <h2 className="calendar-header">{`${currentYear} - ${currentMonth + 1}`}</h2>
            <table className="calendar-table">
                <thead className="calendar-header">
                    <tr>
                        {daysOfWeek.map((day, index) => (
                            <th key={index} className="calendar-header-cell">
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="calendar-body">
                    {Array.from({ length: Math.ceil((numberOfDaysInMonth + daysFromPrevMonth) / 7) }, (_, weekIndex) => (
                        <tr key={weekIndex} className="calendar-row">
                            {Array.from({ length: 7 }, (_, dayIndex) => {
                                const dayNumber = weekIndex * 7 + dayIndex - daysFromPrevMonth + 1;
                                const isCurrentMonth = dayNumber >= 1 && dayNumber <= numberOfDaysInMonth;

                                return (
                                    <td
                                        key={dayIndex}
                                        className={`calendar-cell ${isCurrentMonth ? 'current-month' : 'other-month'}`}
                                        onClick={() => {
                                            console.log(` today is ${dayIndex} the month is ${currentMonth}, the date is ${currentYear}`)
                                        }}
                                    >
                                        {isCurrentMonth ? dayNumber : ''}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Calendar;
