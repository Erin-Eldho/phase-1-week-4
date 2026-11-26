import { createStore } from "./store.js";
import { createRouter } from "./router.js";
import { renderHomePage } from "./pages/homePage.js";
import { renderListPage } from "./pages/listPage.js";
import { renderDetailPage } from "./pages/detailPage.js";
import { renderSettingsPage } from "./pages/settingsPage.js";

const initialState = {
    route: {
        path: "",
        params: {},
        component: null
    },
    settings: {
        darkMode: false
    }
};

function reducer(state, action) {
    switch (action.type) {
        case "SET_ROUTE":
            return {
                ...state,
                route: action.payload
            };
        default:
            return state;
    }
}

const store = createStore(initialState, reducer);
const router = createRouter(store);

router.register("/home", renderHomePage);
router.register("/list", renderListPage);
router.register("/detail/:id", renderDetailPage);
router.register("/settings", renderSettingsPage);

const app = document.querySelector("#app");
let previousRoute = null;

store.subscribe(() => {
    const currentRoute = store.getState().route;
    
    if (currentRoute === previousRoute) {
        return;
    }
    previousRoute = currentRoute;

    if (!currentRoute.component) {
        app.textContent = "404 - Page Not Found";
        return;
    }
    const page = currentRoute.component(store.getState(), currentRoute.params, router.navigate);
    app.replaceChildren(page);
});

router.initRouter();

document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-link]");
    if (!link) {
        return;
    }
    event.preventDefault();
    router.navigate(link.getAttribute("href"));
});

// Expose for browser-console testing.
window.store = store;
window.router = router;
