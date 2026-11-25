const routes = ["home", "about", "services", "contact"];
const sections = document.querySelectorAll("main section");
const navLinks = document.querySelectorAll("nav a");
const breadcrumb = document.getElementById("breadcrumb");
const serviceFilter = document.getElementById("service-filter");
const serviceItems = document.querySelectorAll("#service-list li");

// Navigate between routes without reloading
function navigate(route) {
    if (!routes.includes(route)) {
        route = "home";
    }
    history.pushState({ route }, "", `#/${route}`);
    renderRoute(route);
}

// Display the current route
function renderRoute(route) {
    sections.forEach(section => {
        section.classList.toggle("active", section.id === route);
    });

    // Synchronise active navigation link
    navLinks.forEach(link => {
        const isActive = link.dataset.route === route;
        link.classList.toggle("active", isActive);
        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    // Update breadcrumb
    const currentPath = location.hash.replace("#/", "");
    const pathParts = currentPath.split("/");
    breadcrumb.textContent = "Home";

    pathParts.forEach(part => {
        if (part && part !== "home") {
            breadcrumb.textContent += ` > ${part.charAt(0).toUpperCase() + part.slice(1)}`;
        }
    });
}

// Handle navigation link clicks
navLinks.forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        navigate(link.dataset.route);
    });
});

// Handle browser back and forward buttons
window.addEventListener("popstate", () => {
    const route = location.hash.replace("#/", "") || "home";
    renderRoute(route);
    applyURLFilters();
});

// Read URL search parameters and apply filter
function applyURLFilters() {
    const params = new URLSearchParams(location.search);
    const filter = params.get("filter") || "all";
    serviceFilter.value = filter;
    serviceItems.forEach(item => {
        item.hidden = filter !== "all" && item.dataset.category !== filter;
    });
}

// Update URL when filter changes
serviceFilter.addEventListener("change", () => {
    const params = new URLSearchParams(location.search);
    params.set("filter", serviceFilter.value);
    history.pushState({ route: "services" }, "", `${location.pathname}?${params.toString()}#/services`);
    applyURLFilters();
});

// Initial route and filter
const initialRoute = location.hash.replace("#/", "") || "home";
renderRoute(initialRoute);
applyURLFilters();
