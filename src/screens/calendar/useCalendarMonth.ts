/**
 * Calendar month state hook
 */

import { useState, useCallback } from 'react';
import {
  DAYS,
  MONTHS,
  generateMonthDays,
  generateEmptyDays,
  getDateInfo,
} from './calendarUtils';

export const useCalendarMonth = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const prevMonth = useCallback(() => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  }, [currentDate]);

  const nextMonth = useCallback(() => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  }, [currentDate]);

  const monthDays = generateMonthDays(currentDate);
  const emptyDays = generateEmptyDays(currentDate);
  const currentMonthName = MONTHS[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  return {
    currentDate,
    currentMonthName,
    currentYear,
    days: DAYS,
    months: MONTHS,
    monthDays,
    emptyDays,
    prevMonth,
    nextMonth,
    getDateInfo: (day: number) => getDateInfo(day, currentDate),
  };
};
