import React, { useState } from 'react';
import './calender.css'

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getMonthName = (monthIndex) => {
    return new Date(0, monthIndex).toLocaleString('default', { month: 'long' });
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendar = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = daysInMonth(month, year);

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null); // Empty slots for previous month's days
    }
    for (let day = 1; day <= totalDays; day++) {
      calendarDays.push(day);
    }
    return calendarDays;
  };

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => {
      const prevMonth = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      return prevMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const nextMonth = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      return nextMonth;
    });
  };

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysArray = generateCalendar(month, year);

  return (
    <div className="calendar">
      <div className="navigate-date">
        <h2>{`${getMonthName(month)} ${year}`}</h2>
        <div className="buttons">
          <i className="fa-solid fa-chevron-left" onClick={handlePreviousMonth}></i>
          <i className="fa-solid fa-chevron-right" onClick={handleNextMonth}></i>
        </div>
      </div>
      <div className="weekdays">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>
      <div className="days">
  {daysArray.map((day, index) => (
    <span
      key={index}
      className={`day ${
        day && 
        new Date().getFullYear() === year &&
        new Date().getMonth() === month &&
        day === new Date().getDate()
          ? 'highlight'
          : ''
      } ${day ? '' : 'empty'}`}
    >
      {day || ''}
    </span>
  ))}
</div>

    </div>
  );
};

export default CalendarWidget;
