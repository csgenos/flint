import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';

export function formatMonthYear(date: Date | string): string {
  return format(new Date(date), 'MMM yyyy');
}

export function formatShortDate(date: Date | string): string {
  return format(new Date(date), 'MMM d');
}

export function formatFullDate(date: Date | string): string {
  return format(new Date(date), 'MMMM d, yyyy');
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
  return isWithinInterval(new Date(dateStr), { start, end });
}
