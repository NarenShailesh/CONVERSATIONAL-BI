import { ColumnStats } from './types';

/**
 * A simple CSV parser.
 * Note: This is a basic implementation and may not handle complex cases
 * like commas within quoted fields.
 * @param csvText The raw string content of the CSV file.
 * @returns An object with headers and data rows.
 */
export const parseCSV = (csvText: string): { headers: string[], data: any[] } => {
    const lines = csvText.replace(/\r/g, '').split('\n').filter(line => line.trim() !== '');
    if (lines.length < 1) {
        return { headers: [], data: [] };
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length === headers.length) {
            const entry: { [key: string]: string } = {};
            headers.forEach((header, index) => {
                entry[header] = values[index];
            });
            data.push(entry);
        }
    }
    return { headers, data };
};

const escapeCSVField = (field: any): string => {
    if (field == null) { // handles null and undefined
        return '';
    }
    const stringField = String(field);
    // If field contains a comma, double-quote, or newline, it needs to be quoted.
    if (stringField.search(/("|,|\n)/g) >= 0) {
        // Within a quoted field, any double-quote must be escaped by another double-quote.
        const escapedField = stringField.replace(/"/g, '""');
        return `"${escapedField}"`;
    }
    return stringField;
};

/**
 * Converts a JSON object with headers and data into a CSV formatted string.
 * This version properly escapes fields containing commas, quotes, or newlines.
 * @param jsonData An object with headers and an array of data objects.
 * @returns A string in CSV format.
 */
export const convertToCSV = (jsonData: { headers: string[], data: any[] }): string => {
    const { headers, data } = jsonData;
    const headerRow = headers.map(escapeCSVField).join(',');
    const dataRows = data.map(row => 
        headers.map(header => escapeCSVField(row[header])).join(',')
    );
    return [headerRow, ...dataRows].join('\n');
};

/**
 * Calculates summary statistics for numerical columns in a dataset.
 * @param data An array of data objects.
 * @returns An object with statistics for each numerical column, or null if none are found.
 */
// FIX: Update function signature to return a strongly-typed object based on ColumnStats.
export const calculateSummaryStats = (data: any[]): Record<string, ColumnStats> | null => {
    if (!data || data.length === 0) return null;

    const headers = Object.keys(data[0]);
    const summary: Record<string, ColumnStats> = {};
    let numericalColumnsFound = 0;

    for (const header of headers) {
        // Attempt to convert each value to a number, filtering out non-numeric values.
        const values = data.map(row => parseFloat(row[header])).filter(v => !isNaN(v));

        // Only proceed if there are valid numbers in the column.
        if (values.length > 0) {
            numericalColumnsFound++;
            values.sort((a, b) => a - b);

            const count = values.length;
            const sum = values.reduce((acc, val) => acc + val, 0);
            const mean = sum / count;
            const min = values[0];
            const max = values[values.length - 1];

            let median;
            const mid = Math.floor(count / 2);
            if (count % 2 === 0) {
                median = (values[mid - 1] + values[mid]) / 2;
            } else {
                median = values[mid];
            }

            summary[header] = {
                Count: count,
                Mean: mean.toFixed(2),
                Median: median.toFixed(2),
                Min: min.toFixed(2),
                Max: max.toFixed(2),
            };
        }
    }
    
    return numericalColumnsFound > 0 ? summary : null;
};
