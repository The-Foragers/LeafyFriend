/**
 * Formats a date string to a more readable format.
 * @param dateStr - The date string to format.
 * @returns The formatted date string.
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString(undefined, options);
};