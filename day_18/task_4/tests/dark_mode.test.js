const darkModeModulePath = "../../../../day_5/five-page-website/js/components/darkMode.js";

beforeEach(() => {
    document.body.innerHTML = '<button id="dark-mode-toggle" aria-pressed="false"></button>';
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("Dark Mode Initialization", () => {
    test("should read the saved dark theme preference from localStorage", () => {
        const getItemSpy = jest.spyOn(Storage.prototype, "getItem").mockReturnValue("dark");
        let darkMode;

        jest.isolateModules(() => {
            darkMode = require(darkModeModulePath);
        });

        expect(getItemSpy).toHaveBeenCalledWith("theme");
        expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
        darkMode.initDarkMode();
        const themeToggle = document.getElementById("dark-mode-toggle");
        expect(themeToggle.getAttribute("aria-pressed")).toBe("true");
    });

    test("should remove the dark theme when the saved preference is light", () => {
        const getItemSpy = jest.spyOn(Storage.prototype, "getItem").mockReturnValue("light");
        let darkMode;

        jest.isolateModules(() => {
            darkMode = require(darkModeModulePath);
        });

        expect(getItemSpy).toHaveBeenCalledWith("theme");
        expect(document.documentElement.getAttribute("data-theme")).toBeNull();
        darkMode.initDarkMode();
        const themeToggle = document.getElementById("dark-mode-toggle");
        expect(themeToggle.getAttribute("aria-pressed")).toBe("false");
    });

    test("should return when the dark mode toggle button is missing", () => {
        document.getElementById("dark-mode-toggle").remove();
        jest.spyOn(Storage.prototype, "getItem").mockReturnValue("dark");
        let darkMode;
        jest.isolateModules(() => {
            darkMode = require(darkModeModulePath);
        });
        expect(() => darkMode.initDarkMode()).not.toThrow();
        expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    });

    test("should switch from dark mode to light mode when clicked", () => {
        jest.spyOn(Storage.prototype, "getItem").mockReturnValue("dark");
        const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
        let darkMode;
        jest.isolateModules(() => {
            darkMode = require(darkModeModulePath);
        });
        darkMode.initDarkMode();
        document.getElementById("dark-mode-toggle").click();
        expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
        expect(setItemSpy).toHaveBeenCalledWith("theme", "light");
        expect(document.getElementById("dark-mode-toggle").getAttribute("aria-pressed")).toBe("false");
    });

    test("should switch from light mode to dark mode when clicked", () => {
        jest.spyOn(Storage.prototype, "getItem").mockReturnValue("light");
        const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
        let darkMode;
        jest.isolateModules(() => {
            darkMode = require(darkModeModulePath);
        });
        darkMode.initDarkMode();
        document.getElementById("dark-mode-toggle").click();
        expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
        expect(setItemSpy).toHaveBeenCalledWith("theme", "dark");
        expect(document.getElementById("dark-mode-toggle").getAttribute("aria-pressed")).toBe("true");
    });
});
