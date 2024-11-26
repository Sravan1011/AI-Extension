import React, { useState } from 'react';
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';

const Calendar = ({ tasks, onTaskClick, onDeleteTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const header = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="calendar-nav-button"
        >
          ←
        </button>
        <div className="text-lg font-bold">
          {format(currentDate, dateFormat)}
        </div>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="calendar-nav-button"
        >
          →
        </button>
      </div>
    );
  };

  const daysOfWeek = () => {
    const dateFormat = "EEEE";
    const days = [];
    let startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="calendar-day-header">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="calendar-grid">{days}</div>;
  };

  const cells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayTasks = tasks.filter(task => 
          isSameDay(new Date(task.scheduledDate), cloneDay)
        );

        days.push(
          <div
            key={day}
            className={`calendar-day ${
              !isSameMonth(day, monthStart)
                ? "bg-gray-50 text-gray-400"
                : isSameDay(day, selectedDate)
                ? "bg-blue-50"
                : ""
            }`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <div className="text-right">{format(day, dateFormat)}</div>
            <div className="mt-2 space-y-1">
              {dayTasks.map(task => (
                <div
                  key={task.id}
                  className={`task-item ${
                    task.priority === "High"
                      ? "task-high-priority"
                      : "task-normal-priority"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskClick(task.id);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="truncate">{task.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      className="text-gray-500 hover:text-red-500 ml-2"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day} className="calendar-grid">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="bg-white rounded-lg shadow">{rows}</div>;
  };

  return (
    <div className="h-full flex flex-col">
      {header()}
      {daysOfWeek()}
      <div className="flex-1 overflow-y-auto">
        {cells()}
      </div>
    </div>
  );
};

export default Calendar;