import { jest } from "@jest/globals";
import { createStore, storageMiddleware, loadSavedState } from "../js/store.js";

describe("State Manager", () => {
    let store;
    const initialState = {
        count: 0
    };
    function reducer(state, action) {
        switch (action.type) {
            case "INCREMENT":
                return {
                    ...state,
                    count: state.count + 1
                };

            case "DECREMENT":
                return {
                    ...state,
                    count: state.count - 1
                };

            default:
                return state;
        }
    }

    beforeEach(() => {
        store = createStore(initialState, reducer);
    });

    test("returns the initial state", () => {
        expect(store.getState()).toEqual({ count: 0 });
    });

    test("updates state after dispatching an action", () => {
        store.dispatch({ type: "INCREMENT" });
        expect(store.getState().count).toBe(1);
    });

    test("notifies subscribers after state changes", () => {
        const subscriber = jest.fn();
        store.subscribe(subscriber);
        store.dispatch({ type: "INCREMENT" });
        expect(subscriber).toHaveBeenCalledTimes(1);
    });

    test("does not notify subscribers when state does not change", () => {
        const subscriber = jest.fn();
        store.subscribe(subscriber);
        store.dispatch({ type: "UNKNOWN" });
        expect(subscriber).not.toHaveBeenCalled();
    });

    test("allows a subscriber to unsubscribe", () => {
        const subscriber = jest.fn();
        const unsubscribe = store.subscribe(subscriber);
        unsubscribe();
        store.dispatch({ type: "INCREMENT" });
        expect(subscriber).not.toHaveBeenCalled();
    });

    test("does not fail when an already unsubscribed listener is removed again", () => {
        const subscriber = jest.fn();
        const unsubscribe = store.subscribe(subscriber);
        unsubscribe();
        unsubscribe();
        store.dispatch({ type: "INCREMENT" });
        expect(subscriber).not.toHaveBeenCalled();
    });
});

describe("Storage Middleware", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("saves updated state to localStorage", () => {
        const reducer = (state, action) => {
            if (action.type === "UPDATE") {
                return {
                    ...state,
                    count: action.payload
                };
            }
            return state;
        };

        const store = createStore(
            { count: 0 },
            reducer,
            [storageMiddleware()]
        );

        store.dispatch({
            type: "UPDATE",
            payload: 5
        });
        expect(JSON.parse(localStorage.getItem("movie-library-state"))).toEqual({ count: 5 });
    });

    test("uses a custom storage key", () => {
        const store = createStore(
            { count: 0 },
            (state) => ({ ...state, count: 1 }),
            [storageMiddleware("custom-key")]
        );
        store.dispatch({ type: "UPDATE" });
        expect(JSON.parse(localStorage.getItem("custom-key"))).toEqual({ count: 1 });
    });

    test("handles localStorage write errors", () => {
        const error = new Error("Storage unavailable");
        const storageSpy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw error;
        });
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const store = createStore(
            { count: 0 },
            (state) => ({ ...state, count: 1 }),
            [storageMiddleware()]
        );

        expect(() => {
            store.dispatch({ type: "UPDATE" });
        }).not.toThrow();
        expect(consoleSpy).toHaveBeenCalled();
        storageSpy.mockRestore();
        consoleSpy.mockRestore();
    });
});

describe("Load Saved State", () => {
    const initialState = {
        route: {
            path: "",
            params: {},
            component: null
        },
        movies: [],
        settings: {
            darkMode: false
        },
        loading: false,
        error: null
    };

    beforeEach(() => {
        localStorage.clear();
    });

    test("returns initial state when no saved data exists", () => {
        expect(loadSavedState(initialState)).toEqual(initialState);
    });

    test("loads saved movies and settings", () => {
        localStorage.setItem(
            "movie-library-state",
            JSON.stringify({
                movies: [{ id: "1", title: "Inception" }],
                settings: {
                    darkMode: true
                }
            })
        );

        const result = loadSavedState(initialState);
        expect(result.movies).toEqual([
            { id: "1", title: "Inception" }
        ]);
        expect(result.settings.darkMode).toBe(true);
        expect(result.loading).toBe(false);
        expect(result.error).toBe(null);
    });

    test("uses initial movies when saved movies are not an array", () => {
        localStorage.setItem(
            "movie-library-state",
            JSON.stringify({
                movies: "invalid"
            })
        );
        const result = loadSavedState(initialState);
        expect(result.movies).toEqual(initialState.movies);
    });

    test("preserves the initial route instead of restoring an old route", () => {
        localStorage.setItem(
            "movie-library-state",
            JSON.stringify({
                route: {
                    path: "/detail/5",
                    params: { id: "5" },
                    component: "old-component"
                }
            })
        );
        const result = loadSavedState(initialState);
        expect(result.route).toEqual(initialState.route);
    });

    test("handles invalid JSON and returns initial state", () => {
        localStorage.setItem("movie-library-state", "{invalid json");
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        expect(loadSavedState(initialState)).toEqual(initialState);
        consoleSpy.mockRestore();
    });
});
