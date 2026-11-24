const {
    HttpError,
    fetchJSON,
    debounce,
    memoize,
    fetchWithTimeout
} = require("./async_tests");


// 1. ASYNC TESTS - FETCH JSON
describe("fetchJSON()", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should resolve with JSON data when the HTTP status is 200", async () => {
        const mockData = [{ id: 1, name: "Erin" }, { id: 2, name: "Alex" }];
        jest.spyOn(global, "fetch").mockResolvedValue({
            status: 200,
            statusText: "OK",
            json: jest.fn().mockResolvedValue(mockData)
        });
        const result = await fetchJSON("https://example.com/users");
        expect(result).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test("should reject with HttpError when the HTTP status is not 200", async () => {
        jest.spyOn(global, "fetch").mockResolvedValue({
            status: 404,
            statusText: "Not Found"
        });
        let caughtError;
        try {
            await fetchJSON("https://example.com/users");
        } catch (error) {
            caughtError = error;
        }
        expect(caughtError).toBeInstanceOf(HttpError);
        expect(caughtError.name).toBe("HttpError");
        expect(caughtError.status).toBe(404);
    });

});


// 2. DEBOUNCE - JEST FAKE TIMERS
describe("debounce()", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    test("should call the underlying function only once after the delay when called 10 times rapidly", () => {
        const mockFunction = jest.fn();
        const debouncedFunction = debounce(mockFunction, 500);

        // Call the debounced function 10 times rapidly
        for (let i = 1; i <= 10; i++) {
            debouncedFunction(i);
        }

        // Function should not execute immediately
        expect(mockFunction).not.toHaveBeenCalled();

        // Advance time by 499 milliseconds
        jest.advanceTimersByTime(499);
        expect(mockFunction).not.toHaveBeenCalled();

        // Advance the remaining 1 millisecond
        jest.advanceTimersByTime(1);

        // Function should execute only once
        expect(mockFunction).toHaveBeenCalledTimes(1);

        // The latest argument should be passed
        expect(mockFunction).toHaveBeenCalledWith(10);
    });

});


// 3. MEMOIZE
describe("memoize()", () => {
    test("should call the wrapped function only once for repeated input", () => {
        const mockFunction = jest.fn(value => value * 2);
        const memoizedFunction = memoize(mockFunction);
        const firstResult = memoizedFunction(5);
        const secondResult = memoizedFunction(5);
        const thirdResult = memoizedFunction(5);

        expect(firstResult).toBe(10);
        expect(secondResult).toBe(10);
        expect(thirdResult).toBe(10);

        // Original function should execute only once
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

    test("should call the wrapped function twice for two different inputs", () => {
        const mockFunction = jest.fn(value => value * 2);
        const memoizedFunction = memoize(mockFunction);
        const firstResult = memoizedFunction(5);
        const secondResult = memoizedFunction(10);

        expect(firstResult).toBe(10);
        expect(secondResult).toBe(20);

        // Original function should execute twice
        expect(mockFunction).toHaveBeenCalledTimes(2);
    });

});


// 4. ABORT CONTROLLER TIMEOUT
describe("fetchWithTimeout()", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    test("should abort the request after the configured timeout", async () => {
        let capturedSignal;
        jest.spyOn(global, "fetch").mockImplementation((url, options) => {
            capturedSignal = options.signal;

            // Simulate a request that rejects when aborted
            return new Promise((resolve, reject) => {
                capturedSignal.addEventListener("abort", () => {
                    reject(new Error("Request aborted"));
                }, { once: true });
            });
        });
        const request = fetchWithTimeout("https://example.com/users", 1000);

        // Request should not be aborted immediately
        expect(capturedSignal.aborted).toBe(false);

        // Advance time by 999 milliseconds
        jest.advanceTimersByTime(999);
        expect(capturedSignal.aborted).toBe(false);

        // Advance the final 1 millisecond
        jest.advanceTimersByTime(1);

        // Request should now be aborted
        expect(capturedSignal.aborted).toBe(true);
        await expect(request).rejects.toThrow("Request aborted");
    });
});
