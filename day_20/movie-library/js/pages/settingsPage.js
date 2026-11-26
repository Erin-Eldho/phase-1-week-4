export function renderSettingsPage(state, params) {
    const page = document.createElement("section");
    page.className = "page settings-page";

    const heading = document.createElement("h1");
    heading.textContent = "Settings";

    const description = document.createElement("p");
    description.textContent = "Manage your movie library preferences.";

    const themeLabel = document.createElement("label");
    themeLabel.textContent = "Dark Mode";

    const themeToggle = document.createElement("input");
    themeToggle.type = "checkbox";
    themeToggle.checked = state.settings?.darkMode ?? false;

    page.append(heading, description, themeLabel, themeToggle);
    return page;
}
