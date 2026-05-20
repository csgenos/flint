const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseDateInput(value: Date | string): Date {
  if (value instanceof Date) {
    return value;
  }

  if (LOCAL_DATE_PATTERN.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
}
