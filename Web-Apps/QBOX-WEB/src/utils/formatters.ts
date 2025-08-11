import { format as dateFnsFormat, parseISO } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';  // Import required locales

// --- Date Formatters ---

/**
 * Format a date into a specified format using date-fns.
 * @param date - The date to format, can be a string or Date object.
 * @param formatStr - The format string (e.g., "yyyy-MM-dd", "dd MMM yyyy").
 * @param locale - Optional locale for the formatting (default is 'en-US').
 * @returns Formatted date string.
 */
export const formatDate = (date: string | Date, formatStr: string = 'yyyy-MM-dd', locale: string = 'en-US'): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    const localeObj = locale === 'fr' ? fr : enUS;  // Use 'fr' for French, 'en-US' by default
    return dateFnsFormat(d, formatStr, { locale: localeObj });
};

/**
 * Format a date to a relative time format (e.g., "3 days ago", "1 hour ago").
 * @param date - The date to format, can be a string or Date object.
 * @returns A human-readable relative time string.
 */
export const formatRelativeDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - d.getTime();
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    return `${days} day${days === 1 ? '' : 's'} ago`;
};

// --- Currency Formatters ---

/**
 * Format a number as currency (e.g., $1,000.00).
 * @param value - The value to format.
 * @param locale - Locale (default is 'en-US').
 * @param currency - Currency code (default is 'USD').
 * @param options - Custom options for formatting (e.g., minimumFractionDigits, maximumFractionDigits).
 * @returns Formatted currency string.
 */
export const formatCurrency = (
    value: number,
    locale: string = 'en-US',
    currency: string = 'USD',
    options?: Intl.NumberFormatOptions
): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        ...options,
    }).format(value);
};

/**
 * Format a number as a simple currency without the symbol (e.g., 1,000.00).
 * @param value - The value to format.
 * @param locale - Locale (default is 'en-US').
 * @returns Formatted currency value as string.
 */
export const formatCurrencyWithoutSymbol = (value: number, locale: string = 'en-US'): string => {
    return new Intl.NumberFormat(locale, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

// --- Number Formatters ---

/**
 * Format number with commas as thousands separator (e.g., 1,000,000).
 * @param value - The value to format.
 * @param locale - The locale (default is 'en-US').
 * @returns Formatted number with commas.
 */
export const formatNumberWithCommas = (value: number, locale: string = 'en-US'): string => {
    return value.toLocaleString(locale);
};

/**
 * Format a number as a percentage (e.g., 75%).
 * @param value - The percentage value (e.g., 0.75 for 75%).
 * @param locale - Locale (default is 'en-US').
 * @param options - Custom options for percentage formatting.
 * @returns Formatted percentage string.
 */
export const formatPercentage = (
    value: number,
    locale: string = 'en-US',
    options?: Intl.NumberFormatOptions
): string => {
    return new Intl.NumberFormat(locale, {
        style: 'percent',
        ...options,
    }).format(value);
};

/**
 * Format a number with a fixed number of decimal places (e.g., 3.1416).
 * @param value - The value to format.
 * @param decimalPlaces - Number of decimal places to retain.
 * @returns Formatted number with specified decimal places.
 */
export const formatFixedDecimal = (value: number, decimalPlaces: number = 2): string => {
    return value.toFixed(decimalPlaces);
};

/**
 * Format a number into scientific notation (e.g., 1.23e+6).
 * @param value - The value to format.
 * @param options - Custom options for scientific notation formatting.
 * @returns Formatted number in scientific notation.
 */
export const formatScientific = (value: number, options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat('en-US', {
        notation: 'scientific',
        ...options
    }).format(value);
};

// --- Time Duration Formatter ---

/**
 * Format a time duration in a human-readable form (e.g., "1 hour 45 minutes").
 * @param duration - The time duration in milliseconds.
 * @returns A human-readable time duration string.
 */
export const formatDuration = (duration: number): string => {
    const hours = Math.floor(duration / 3600000); // 1 hour = 3600000 milliseconds
    const minutes = Math.floor((duration % 3600000) / 60000); // 1 minute = 60000 milliseconds
    const seconds = Math.floor((duration % 60000) / 1000); // 1 second = 1000 milliseconds

    let result = '';
    if (hours > 0) result += `${hours} hour${hours > 1 ? 's' : ''} `;
    if (minutes > 0) result += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    if (seconds > 0) result += `${seconds} second${seconds > 1 ? 's' : ''}`;

    return result.trim() || '0 seconds';
};

