/**
 * Calendar date utilities
 */

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MONTHS = [
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

export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const isToday = (day: number, currentDate: Date): boolean => {
  const today = new Date();
  return (
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear()
  );
};

export const generateMonthDays = (currentDate: Date): number[] => {
  const daysInMonth = getDaysInMonth(currentDate);
  return Array(daysInMonth)
    .fill(0)
    .map((_, i) => i + 1);
};

export const generateEmptyDays = (currentDate: Date): number[] => {
  const firstDay = getFirstDayOfMonth(currentDate);
  return Array(firstDay).fill(0);
};

export interface CalendarDateInfo {
  day: number;
  isToday: boolean;
  dateLabel: string;
}

export const getDateInfo = (
  day: number,
  currentDate: Date,
): CalendarDateInfo => {
  const monthName = MONTHS[currentDate.getMonth()];
  return {
    day,
    isToday: isToday(day, currentDate),
    dateLabel: `${monthName} ${day}, ${currentDate.getFullYear()}`,
  };
};
