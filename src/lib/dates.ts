export function isValidCalendarDate(date: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    !Number.isNaN(Date.parse(`${date}T00:00:00.000Z`)) &&
    new Date(`${date}T00:00:00.000Z`)
      .toISOString()
      .startsWith(date)
  );
}
