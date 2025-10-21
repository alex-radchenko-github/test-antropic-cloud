'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useTodoStore from '@/store/todoStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function CalendarView() {
  const { tasks, toggleTaskStatus } = useTodoStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDay = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const today = () => setCurrentMonth(new Date());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </h2>
          <button
            onClick={today}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Сегодня
          </button>
        </div>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
            <div
              key={day}
              className="bg-gray-50 py-3 text-center text-sm font-semibold text-gray-700"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day) => {
            const dayTasks = getTasksForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <div
                key={day.toString()}
                className={`bg-white min-h-[120px] p-2 ${
                  !isCurrentMonth ? 'opacity-40' : ''
                } ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-sm font-medium ${
                      isToday
                        ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center'
                        : 'text-gray-700'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className={`text-xs p-1 rounded cursor-pointer group ${
                        task.status === 'done'
                          ? 'bg-green-100 text-green-800 line-through'
                          : task.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      onClick={() => toggleTaskStatus(task.id)}
                    >
                      <div className="flex items-start gap-1">
                        <input
                          type="checkbox"
                          checked={task.status === 'done'}
                          onChange={() => toggleTaskStatus(task.id)}
                          className="mt-0.5 h-3 w-3 rounded border-gray-300"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="flex-1 truncate leading-tight">
                          {task.title}
                        </span>
                      </div>
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{dayTasks.length - 3} еще
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Задачи без даты</h3>
        <div className="space-y-2">
          {tasks
            .filter((t) => !t.dueDate)
            .slice(0, 5)
            .map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
              >
                <input
                  type="checkbox"
                  checked={task.status === 'done'}
                  onChange={() => toggleTaskStatus(task.id)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span
                  className={`text-sm ${
                    task.status === 'done' ? 'line-through text-gray-400' : ''
                  }`}
                >
                  {task.title}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
