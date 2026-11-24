// SETUP - BEFORE EACH TEST
beforeEach(() => {
    // Reset DOM to a known state before every test
    document.body.innerHTML = '<div id="app"></div>';
});

// TEARDOWN - AFTER EACH TEST
afterEach(() => {
    // Restore all mocked functions and spies
    jest.restoreAllMocks();
});

// TEST 1 - DOM SETUP
describe("DOM Setup", () => {
    test("should initialize the DOM with an app element", () => {
        const app = document.getElementById("app");
        expect(app).not.toBeNull();
        expect(app.tagName).toBe("DIV");
        expect(document.body.innerHTML).toBe('<div id="app"></div>');
    });

    test("should allow DOM elements to be modified", () => {
        const app = document.getElementById("app");
        app.innerHTML = "<h1>Hello World</h1>";
        expect(app.innerHTML).toBe("<h1>Hello World</h1>");
    });
});

// TEST 2 - MOCK RESTORATION
describe("Mock Restoration", () => {
    test("should allow a DOM method to be mocked", () => {
        const getElementSpy = jest.spyOn(document, "getElementById").mockReturnValue(null);
        const result = document.getElementById("app");
        expect(result).toBeNull();
        expect(getElementSpy).toHaveBeenCalledWith("app");
        expect(getElementSpy).toHaveBeenCalledTimes(1);
    });
});
