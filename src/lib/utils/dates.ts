import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { parseDateInput } from './dateParsing';

export function formatMonthYear(date: Date | string): string {
  return format(parseDateInput(date), 'MMM yyyy');
}

export function formatShortDate(date: Date | string): string {
  return format(parseDateInput(date), 'MMM d');
}

export function formatFullDate(date: Date | string): string {
  return format(parseDateInput(date), 'MMMM d, yyyy');
}

export function getCurrentMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  return { start: startOfMonth(now), end: endOfMonth(now) };
}

export function getPreviousMonthRange(monthsBack = 1): { start: Date; end: Date } {
  const d = subMonths(new Date(), monthsBack);
  return { start: startOfMonth(d), end: endOfMonth(d) };
}

export function isInCurrentMonth(dateStr: string): boolean {
  const { start, end } = getCurrentMonthRange();
  return isWithinInterval(parseDateInput(dateStr), { start, end });
}
