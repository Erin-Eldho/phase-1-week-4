const { formatDate } = require("./format_date");

describe("formatDate()", () => {
    test("should format a date as DD/MM/YYYY", () => {
        const result = formatDate("2025-03-08T12:00:00", "DD/MM/YYYY");
        expect(result).toBe("08/03/2025");
    });

    test("should format a date as YYYY-MM-DD", () => {
        const result = formatDate("2025-03-08T12:00:00", "YYYY-MM-DD");
        expect(result).toBe("2025-03-08");
    });

    test("should format a date as Month DD, YYYY", () => {
        const result = formatDate("2025-03-08T12:00:00", "Month DD, YYYY");
        expect(result).toBe("March 08, 2025");
    });

    test("should format a date relative to the current date", () => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2025-01-10T12:00:00"));
        const result = formatDate("2025-01-07T12:00:00", "relative");
        expect(result).toBe("3 days ago");
        jest.useRealTimers();
    });

    test("should correctly format February 29 in a leap year", () => {
        const result = formatDate("2024-02-29T12:00:00", "DD/MM/YYYY");
        expect(result).toBe("29/02/2024");
    });

    test("should correctly format December 31", () => {
        const result = formatDate("2024-12-31T12:00:00", "YYYY-MM-DD");
        expect(result).toBe("2024-12-31");
    });

    test("should accept a Date object as input", () => {
        const date = new Date(2025, 5, 15, 12);
        const result = formatDate(date, "DD/MM/YYYY");
        expect(result).toBe("15/06/2025");
    });

    test("should throw a RangeError for an invalid date", () => {
        expect(() => {
            formatDate("invalid-date", "DD/MM/YYYY");
        }).toThrow(RangeError);
    });

    test("should throw a RangeError for an unsupported format", () => {
        expect(() => {
            formatDate("2025-03-08", "DD-MM-YYYY");
        }).toThrow(RangeError);
    });

    test("should format future dates relative to the current date", () => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2025-01-07T12:00:00"));
        const result = formatDate("2025-01-10T12:00:00", "relative");
        expect(result).toBe("in 3 days");
        jest.useRealTimers();
    });
});
