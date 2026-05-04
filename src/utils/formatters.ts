/**
 * Formats a date to a readable Islamic context string if needed,
 * or simply wraps standard formatting for consistency.
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Truncates text with ellipses
 */
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Formats numbers with leading zeros (e.g., for Ayah or Surah numbers)
 */
export const formatNumber = (num: number, digits: number = 2): string => {
  return num.toString().padStart(digits, '0');
};

/**
 * Simple conditional class joiner (alternative to clsx/tailwind-merge for simple cases)
 */
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};
