const darkModeModulePath =
    "../../../../day_5/five-page-website/js/components/darkMode";

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
        expect(getItemSpy).toHaveBeenCalledTimes(1);
        expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
        darkMode.initDarkMode();
        const themeToggle = document.getElementById("dark-mode-toggle");
        expect(themeToggle.getAttribute("aria-pressed")).toBe("true");
    });

    test("should remove the dark theme when the saved preference is light", () => {
        document.documentElement.setAttribute("data-theme", "dark");
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
});
