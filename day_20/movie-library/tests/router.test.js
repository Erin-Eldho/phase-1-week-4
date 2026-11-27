import { jest } from "@jest/globals";
import { createRouter } from "../js/router.js";
import { createStore } from "../js/store.js";

describe("Router", () => {
    let store;
    let router;
    let container;

    const initialState = {
        route: {
            path: "",
            params: {},
            component: null
        }
    };

    function reducer(state, action) {
        if (action.type === "SET_ROUTE") {
            return {
                ...state,
                route: action.payload
            };
        }
        return state;
    }

    beforeEach(() => {
        window.history.replaceState({}, "", "/");
        container = document.createElement("div");
        document.body.appendChild(container);
        store = createStore(initialState, reducer);
        router = createRouter(store);

        store.subscribe(() => {
            const state = store.getState();
            const route = state.route;
            container.replaceChildren();

            if (route.component) {
                container.appendChild(
                    route.component(state, route.params, router.navigate)
                );
            } else {
                container.textContent = "Page Not Found";
            }
        });
    });

    afterEach(() => {
        container.remove();
    });

    test("navigates to a registered route and changes the URL", () => {
        const homePage = () => {
            const element = document.createElement("h1");
            element.textContent = "Home Page";
            return element;
        };

        router.register("/home", homePage);
        router.navigate("/home");
        expect(window.location.pathname).toBe("/home");
        expect(container.textContent).toBe("Home Page");
    });

    test("renders the correct registered component", () => {
        const listPage = () => {
            const element = document.createElement("h1");
            element.textContent = "Movies Page";
            return element;
        };

        router.register("/list", listPage);
        router.navigate("/list");
        expect(container.querySelector("h1").textContent).toBe("Movies Page");
    });

    test("extracts dynamic route parameters", () => {
        const detailPage = jest.fn((state, params) => {
            const element = document.createElement("h1");
            element.textContent = `Movie ${params.id}`;
            return element;
        });

        router.register("/detail/:id", detailPage);
        router.navigate("/detail/5");
        expect(window.location.pathname).toBe("/detail/5");
        expect(detailPage).toHaveBeenCalledWith(
            expect.any(Object),
            { id: "5" },
            router.navigate
        );
        expect(container.textContent).toBe("Movie 5");
    });

    test("handles an unknown route", () => {
        router.register("/home", () => document.createElement("div"));
        router.navigate("/unknown");
        expect(store.getState().route.component).toBe(null);
        expect(container.textContent).toBe("Page Not Found");
    });

    test("navigates to home when the initial URL is root", () => {
        const homePage = () => {
            const element = document.createElement("h1");
            element.textContent = "Home Page";
            return element;
        };

        router.register("/home", homePage);
        router.initRouter();
        expect(window.location.pathname).toBe("/home");
        expect(container.textContent).toBe("Home Page");
    });

    test("renders the current route when the router is initialized", () => {
        window.history.replaceState({}, "", "/list");
        const listPage = () => {
            const element = document.createElement("h1");
            element.textContent = "Movies Page";
            return element;
        };

        router.register("/list", listPage);
        router.initRouter();
        expect(container.textContent).toBe("Movies Page");
    });

    test("handles browser back and forward navigation", () => {
        const homePage = () => {
            const element = document.createElement("h1");
            element.textContent = "Home Page";
            return element;
        };

        const listPage = () => {
            const element = document.createElement("h1");
            element.textContent = "Movies Page";
            return element;
        };

        router.register("/home", homePage);
        router.register("/list", listPage);
        router.initRouter();
        router.navigate("/list");

        window.history.replaceState({}, "", "/home");
        window.dispatchEvent(new PopStateEvent("popstate"));
        expect(store.getState().route.path).toBe("/home");
        expect(container.textContent).toBe("Home Page");
    });

    test("supports navigation under the GitHub Pages base path", () => {
        window.history.replaceState({}, "", "/phase-1-week-4/");
        const homePage = () => {
            const element = document.createElement("h1");
            element.textContent = "Home Page";
            return element;
        };

        router.register("/home", homePage);
        router.initRouter();
        expect(window.location.pathname).toBe("/phase-1-week-4/home");
        expect(store.getState().route.path).toBe("/home");
        expect(container.textContent).toBe("Home Page");
    });

    test("handles navigation when the base path has no trailing slash", () => {
        window.history.replaceState({}, "", "/phase-1-week-4");
        const homePage = () => {
            const element = document.createElement("h1");
            element.textContent = "Home Page";
            return element;
        };

        router.register("/home", homePage);
        router.initRouter();
        expect(window.location.pathname).toBe("/phase-1-week-4/home");
        expect(container.textContent).toBe("Home Page");
    });

    test("handles navigation using a path that already includes the base path", () => {
        window.history.replaceState({}, "", "/phase-1-week-4/");
        const listPage = () => {
            const element = document.createElement("h1");
            element.textContent = "Movies Page";
            return element;
        };

        router.register("/list", listPage);
        router.navigate("/phase-1-week-4/list");
        expect(window.location.pathname).toBe("/phase-1-week-4/list");
        expect(store.getState().route.path).toBe("/list");
        expect(container.textContent).toBe("Movies Page");
    });
});
