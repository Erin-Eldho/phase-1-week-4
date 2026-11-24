const { initMobileNav } = require(
    "../../../../day_5/five-page-website/js/components/nav.js"
);

beforeEach(() => {
    document.body.innerHTML = `
        <button id="nav-toggle" aria-expanded="false">
            Menu
        </button>

        <nav id="mobile-nav">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
        </nav>

        <div id="nav-overlay"></div>
    `;
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("Mobile Navigation", () => {
    test("should open the navigation drawer when hamburger is clicked", () => {
        initMobileNav();
        const navToggle = document.getElementById("nav-toggle");
        const mobileNav = document.getElementById("mobile-nav");
        const navOverlay = document.getElementById("nav-overlay");
        const firstLink = mobileNav.querySelector("a");
        navToggle.click();
        expect(mobileNav.classList.contains("open")).toBe(true);
        expect(navOverlay.classList.contains("open")).toBe(true);
        expect(navToggle.getAttribute("aria-expanded")).toBe("true");
        expect(document.activeElement).toBe(firstLink);
    });

    test("should trap keyboard focus inside the open navigation drawer", () => {
        initMobileNav();
        const navToggle = document.getElementById("nav-toggle");
        const mobileNav = document.getElementById("mobile-nav");
        const navLinks = mobileNav.querySelectorAll("a");
        const firstLink = navLinks[0];
        const lastLink = navLinks[navLinks.length - 1];
        navToggle.click();

        // Test Tab from the last link
        lastLink.focus();

        const forwardTab = new KeyboardEvent("keydown", {
            key: "Tab",
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(forwardTab);
        expect(forwardTab.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(firstLink);

        // Test Shift+Tab from the first link
        firstLink.focus();

        const backwardTab = new KeyboardEvent("keydown", {
            key: "Tab",
            shiftKey: true,
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(backwardTab);
        expect(backwardTab.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(lastLink);
    });
});
