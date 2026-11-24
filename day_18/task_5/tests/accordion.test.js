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
        expect(panel.textContent.trim()).toBe("First panel content");
    });

    test("should close the panel when its open header is clicked again", () => {
        initAccordion();
        const button = document.getElementById("accordion-one");
        const panel = document.getElementById("panel-one");
        button.click();
        button.click();
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(panel.hidden).toBe(true);
    });
});
