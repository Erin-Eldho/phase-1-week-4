jest.mock("../../../../day_5/five-page-website/js/utils.js", () => ({
    showToast: jest.fn()
}));

const { FormValidator } = require(
    "../../../../day_5/five-page-website/js/form_validator.js"
);

beforeEach(() => {
    document.body.innerHTML = `
        <form id="contact-form">
            <input type="text" name="name" id="name">
            <span id="name-error" hidden></span>

            <input type="email" name="email" id="email">
            <span id="email-error" hidden></span>

            <input type="tel" name="phone" id="phone">
            <span id="phone-error" hidden></span>

            <select name="department" id="department">
                <option value="">Select department</option>
                <option value="engineering">Engineering</option>
            </select>
            <span id="department-error" hidden></span>

            <textarea name="message" id="message"></textarea>
            <span id="message-error" hidden></span>

            <button type="submit">Send Message</button>
        </form>
    `;
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("FormValidator", () => {
    test("should display validation errors for invalid form fields", () => {
        const form = document.getElementById("contact-form");
        const validator = new FormValidator(form);
        const result = validator.validateForm();

        expect(result).toBe(false);
        expect(document.getElementById("name-error").textContent).toBe("Name must contain at least 2 characters.");
        expect(document.getElementById("email-error").textContent).toBe("Please enter a valid email address.");
        expect(document.getElementById("department-error").textContent).toBe("Please select a department.");
        expect(document.getElementById("message-error").textContent).toBe("Message must contain at least 20 characters.");
        expect(document.getElementById("name-error").hidden).toBe(false);
        expect(document.getElementById("email-error").hidden).toBe(false);
    });

    test("should clear validation errors when the fields become valid", () => {
        const form = document.getElementById("contact-form");
        const validator = new FormValidator(form);
        validator.validateForm();
        const name = form.elements.name;
        const email = form.elements.email;
        const phone = form.elements.phone;
        const department = form.elements.department;
        const message = form.elements.message;

        name.value = "Erin";
        email.value = "erin@example.com";
        phone.value = "9876543210";
        department.value = "engineering";
        message.value = "This is a valid contact message.";

        name.dispatchEvent(new Event("input", { bubbles: true }));
        email.dispatchEvent(new Event("input", { bubbles: true }));
        phone.dispatchEvent(new Event("input", { bubbles: true }));
        department.dispatchEvent(new Event("change", { bubbles: true }));
        message.dispatchEvent(new Event("input", { bubbles: true }));

        expect(document.getElementById("name-error").textContent).toBe("");
        expect(document.getElementById("email-error").textContent).toBe("");
        expect(document.getElementById("department-error").textContent).toBe("");
        expect(document.getElementById("message-error").textContent).toBe("");

        expect(document.getElementById("name-error").hidden).toBe(true);
        expect(document.getElementById("email-error").hidden).toBe(true);
        expect(document.getElementById("department-error").hidden).toBe(true);
        expect(document.getElementById("message-error").hidden).toBe(true);
        expect(validator.validateForm()).toBe(true);
    });
});
