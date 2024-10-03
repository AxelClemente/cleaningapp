'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isBefore, isToday, isSameDay } from 'date-fns'

interface CalendarProps {
  onSelectDate: (date: Date) => void
}

export function Calendar({ onSelectDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const today = new Date()

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  })

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const handleDateSelect = (day: Date) => {
    setSelectedDate(day)
    onSelectDate(day)
  }

  return (
    <div className="w-72 bg-white shadow rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">{format(currentMonth, 'MMMM yyyy')}</h3>
        <div className="flex space-x-1">
          <button onClick={goToPreviousMonth} className="p-1 bg-white border border-gray-300 rounded-md">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={goToNextMonth} className="p-1 bg-white border border-gray-300 rounded-md">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-xs font-medium text-gray-500">{day}</div>
        ))}
        {daysInMonth.map((day: Date) => {
          const isDisabled = isBefore(day, today) && !isToday(day)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          return (
            <button
              key={day.toString()}
              onClick={() => !isDisabled && handleDateSelect(day)}
              disabled={isDisabled}
              className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm
                ${!isSameMonth(day, currentMonth) ? 'text-gray-300' : ''}
                ${isToday(day) ? 'bg-[#d7ceff] text-white' : ''}
                ${isSelected ? 'bg-[#724fff] text-white' : ''}
                ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
              `}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}