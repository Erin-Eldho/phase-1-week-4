const {EventEmitter, fetchJSON, retry} = require("./mock_functions");


// 1. EVENT EMITTER - jest.fn()
describe("EventEmitter()", () => {
    test("should call each listener with the correct arguments", () => {
        const emitter = new EventEmitter();
        const firstListener = jest.fn();
        const secondListener = jest.fn();

        // Register listeners
        emitter.on("message", firstListener);
        emitter.on("message", secondListener);

        // Emit event with arguments
        emitter.emit("message", "Hello", 200);

        // Verify that both listeners received the correct arguments
        expect(firstListener).toHaveBeenCalledWith("Hello", 200);
        expect(secondListener).toHaveBeenCalledWith("Hello", 200);

        // Verify that each listener was called once
        expect(firstListener).toHaveBeenCalledTimes(1);
        expect(secondListener).toHaveBeenCalledTimes(1);
    });

    test("should call only the listeners registered for the emitted event", () => {
        const emitter = new EventEmitter();
        const messageListener = jest.fn();
        const loginListener = jest.fn();

        emitter.on("message", messageListener);
        emitter.on("login", loginListener);
        emitter.emit("message", "New message");

        expect(messageListener).toHaveBeenCalledWith("New message");
        expect(loginListener).not.toHaveBeenCalled();
    });

});


// 2. FETCH JSON - jest.spyOn()
describe("fetchJSON()", () => {

    afterEach(() => { 
        jest.restoreAllMocks();
    });

    test("should return JSON data when the fetch request succeeds", async () => {
        const url = "https://example.com/users";
        const mockData = [{ id: 1, name: "Erin" }, { id: 2, name: "Alex" }];
        const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({ok: true,
                json: jest.fn().mockResolvedValue(mockData)
            });
        const result = await fetchJSON(url);
        expect(result).toEqual(mockData);
        expect(fetchSpy).toHaveBeenCalledWith(url);
        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });


    test("should throw an error when the HTTP response is unsuccessful", async () => {
        const url = "https://example.com/users";
        jest.spyOn(global, "fetch").mockResolvedValue({
            ok: false,
                status: 404
            });
        await expect(fetchJSON(url)).rejects.toThrow("HTTP error! Status: 404");
    });

    test("should reject when the network request fails", async () => {
        const url = "https://example.com/users";
        jest.spyOn(global, "fetch").mockRejectedValue(new Error("Network failure"));
        await expect(fetchJSON(url)).rejects.toThrow("Network failure");
    });

});


// 3. RETRY LOGIC - mockImplementationOnce()
describe("retry()", () => {
    test("should retry when the first call fails and succeed on the second call", async () => {
        
        // Create a mock function:
        // First call fails.
        // Second call succeeds.
        const mockOperation = jest.fn()
            .mockImplementationOnce(() => {
                return Promise.reject(new Error("Temporary failure"));
            })
            .mockImplementationOnce(() => {
                return Promise.resolve("Operation successful");
            });
        const result = await retry(mockOperation, 2);
        expect(result).toBe("Operation successful");
        expect(mockOperation).toHaveBeenCalledTimes(2);
    });
});
