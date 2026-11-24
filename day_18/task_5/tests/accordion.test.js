const { initAccordion } = require(
    "../../../../day_5/five-page-website/js/components/accordion.js"
);

beforeEach(() => {
    document.body.innerHTML = `
        <section>
            <button id="accordion-one" class="accordion-toggle" aria-expanded="false" aria-controls="panel-one">
                First Section
            </button>

            <div id="panel-one" hidden>
                First panel content
            </div>

            <button id="accordion-two" class="accordion-toggle" aria-expanded="false" aria-controls="panel-two">
                Second Section
            </button>

            <div id="panel-two" hidden>
                Second panel content
            </div>
        </section>
    `;
    sessionStorage.clear();
});

afterEach(() => {
    jest.restoreAllMocks();
    sessionStorage.clear();
});

describe("Accordion", () => {
    test("should open the panel when its header is clicked", () => {
        initAccordion();
        const button = document.getElementById("accordion-one");
        const panel = document.getElementById("panel-one");
        button.click();
        expect(button.getAttribute("aria-expanded")).toBe("true");
        expect(panel.hidden).toBe(false);
        expect(sessionStorage.getItem("openAccordionPanel")).toBe("accordion-one");
    });

    test("should close the panel when its open header is clicked again", () => {
        initAccordion();
        const button = document.getElementById("accordion-one");
        const panel = document.getElementById("panel-one");
        button.click();
        button.click();
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(panel.hidden).toBe(true);
        expect(sessionStorage.getItem("openAccordionPanel")).toBeNull();
    });

    test("should close the previous panel when another panel is opened", () => {
        initAccordion();
        const firstButton = document.getElementById("accordion-one");
        const secondButton = document.getElementById("accordion-two");
        const firstPanel = document.getElementById("panel-one");
        const secondPanel = document.getElementById("panel-two");
        firstButton.click();
        secondButton.click();
        expect(firstButton.getAttribute("aria-expanded")).toBe("false");
        expect(firstPanel.hidden).toBe(true);
        expect(secondButton.getAttribute("aria-expanded")).toBe("true");
        expect(secondPanel.hidden).toBe(false);
    });

    test("should navigate to the next and previous headers using arrow keys", () => {
        initAccordion();
        const firstButton = document.getElementById("accordion-one");
        const secondButton = document.getElementById("accordion-two");
        const arrowDown = new KeyboardEvent("keydown", {
            key: "ArrowDown",
            bubbles: true,
            cancelable: true
        });
        firstButton.dispatchEvent(arrowDown);
        expect(arrowDown.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(secondButton);
        const arrowUp = new KeyboardEvent("keydown", {
            key: "ArrowUp",
            bubbles: true,
            cancelable: true
        });
        secondButton.dispatchEvent(arrowUp);
        expect(arrowUp.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(firstButton);
    });

    test("should navigate to the first and last headers using Home and End keys", () => {
        initAccordion();
        const firstButton = document.getElementById("accordion-one");
        const secondButton = document.getElementById("accordion-two");
        const home = new KeyboardEvent("keydown", {
            key: "Home",
            bubbles: true,
            cancelable: true
        });
        secondButton.dispatchEvent(home);
        expect(home.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(firstButton);
        const end = new KeyboardEvent("keydown", {
            key: "End",
            bubbles: true,
            cancelable: true
        });
        firstButton.dispatchEvent(end);
        expect(end.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(secondButton);
    });

    test("should restore the previously opened panel from sessionStorage", () => {
        sessionStorage.setItem("openAccordionPanel", "accordion-two");
        initAccordion();
        const firstButton = document.getElementById("accordion-one");
        const secondButton = document.getElementById("accordion-two");
        const firstPanel = document.getElementById("panel-one");
        const secondPanel = document.getElementById("panel-two");
        expect(firstButton.getAttribute("aria-expanded")).toBe("false");
        expect(firstPanel.hidden).toBe(true);
        expect(secondButton.getAttribute("aria-expanded")).toBe("true");
        expect(secondPanel.hidden).toBe(false);
    });

    test("should ignore a saved panel that is not an accordion button", () => {
        const invalidButton = document.createElement("button");
        invalidButton.id = "invalid-button";
        document.body.appendChild(invalidButton);
        sessionStorage.setItem("openAccordionPanel", "invalid-button");
        initAccordion();
        expect(document.getElementById("accordion-one").getAttribute("aria-expanded")).toBe("false");
        expect(document.getElementById("accordion-two").getAttribute("aria-expanded")).toBe("false");
    });

    test("should return when no accordion buttons exist", () => {
        document.body.innerHTML = "<p>No accordion available</p>";
        expect(() => initAccordion()).not.toThrow();
    });

    test("should ignore unsupported keyboard keys", () => {
        initAccordion();
        const firstButton = document.getElementById("accordion-one");
        firstButton.focus();
        const event = new KeyboardEvent("keydown", {
            key: "Enter",
            bubbles: true,
            cancelable: true
        });
        firstButton.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
        expect(document.activeElement).toBe(firstButton);
    });
});
