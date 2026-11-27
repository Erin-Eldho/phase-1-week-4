import {createStore, storageMiddleware, loadSavedState} from "./store.js";
import { createRouter } from "./router.js";
import { movies } from "./movieData.js";
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
    movies,
    settings: {
        darkMode: false
    },
    loading: false,
    error: null
};

function reducer(state, action) {
    switch (action.type) {
        case "SET_ROUTE": return {
            ...state,
            route: action.payload
        };
        
        case "ADD_MOVIE": return {
            ...state,
            movies: [...state.movies, action.payload],
            error: null
        };

        case "UPDATE_MOVIE": return {
            ...state,
            movies: state.movies.map((movie) =>
                movie.id === action.payload.id ? { ...movie, ...action.payload } : movie
            ),
            error: null
        };

        case "DELETE_MOVIE": return {
            ...state,
            movies: state.movies.filter(
                (movie) => movie.id !== action.payload
            ),
            error: null
        };

        case "UPDATE_SETTINGS": return {
            ...state,
            settings: {
                ...state.settings,
                ...action.payload
            }
        };

        case "SET_LOADING": return {
            ...state,
            loading: action.payload
        };

        case "SET_ERROR": return {
            ...state,
            error: action.payload
        };

        default: return state;
    }
}

const savedState = loadSavedState(initialState);
const store = createStore(savedState, reducer, [storageMiddleware()]);
const router = createRouter(store);

router.register("/home", renderHomePage);
router.register("/list", renderListPage);
router.register("/detail/:id", renderDetailPage);
router.register("/settings", renderSettingsPage);

const app = document.querySelector("#app");

function renderApp() {
    const state = store.getState();
    const currentRoute = state.route;
    if (!currentRoute.component) {
        app.textContent = "404 - Page Not Found";
        return;
    }
    const page = currentRoute.component(state, currentRoute.params, router.navigate, store.dispatch);
    document.body.classList.toggle("dark-mode", state.settings.darkMode);
    app.replaceChildren(page);
}

store.subscribe(renderApp);
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
