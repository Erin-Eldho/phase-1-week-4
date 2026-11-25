const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const preview = document.getElementById("preview");
const status = document.getElementById("status");
const deleteButton = document.getElementById("delete-email");

// Registered view functions
const views = new Set();

function registerView(viewFunction) {
    views.add(viewFunction);
}

// Notify all registered views
function notifyViews() {
    views.forEach(viewFunction => viewFunction());
}

// Original state object
const initialState = {
    name: "",
    email: ""
};

// Create reactive state using Proxy
const state = new Proxy(initialState, {

    // Intercept property access
    get(target, property, receiver) {
        console.log(`GET: ${String(property)}`);
        return Reflect.get(target, property, receiver);
    },

    // Intercept property changes
    set(target, property, value, receiver) {
        console.log(`SET: ${String(property)} = ${value}`);
        const result = Reflect.set(target, property, value, receiver);
        if (result) {
            notifyViews();
        }
        return result;
    },

    // Intercept property deletion
    deleteProperty(target, property) {
        console.log(`DELETE: ${String(property)}`);
        const result = Reflect.deleteProperty(target, property);
        if (result) {
            notifyViews();
        }
        return result;
    }
});

// View function: update the live preview
function renderPreview() {
    const name = state.name || "Not provided";
    const email = state.email || "Not provided";
    preview.textContent = `Name: ${name} | Email: ${email}`;

    // Keep input values synchronized with state
    if (nameInput.value !== (state.name || "")) {
        nameInput.value = state.name || "";
    }
    if (emailInput.value !== (state.email || "")) {
        emailInput.value = state.email || "";
    }
}

// Register the view function
registerView(renderPreview);

renderPreview();

// Bind name input to state.name
nameInput.addEventListener("input", event => {
    state.name = event.target.value;
});

// Bind email input to state.email
emailInput.addEventListener("input", event => {
    state.email = event.target.value;
});

// Demonstrate deleteProperty
deleteButton.addEventListener("click", () => {
    delete state.email;
    status.textContent = "The email property was deleted from reactive state.";
});
