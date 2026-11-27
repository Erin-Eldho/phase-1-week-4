export function storageMiddleware(storageKey = "movie-library-state") {
    return (store) => (next) => (action) => {
        const result = next(action);
        try {
            localStorage.setItem(storageKey, JSON.stringify(store.getState()));
        } catch (error) {
            console.error("Unable to save application state:", error);
        }
        return result;
    };
}

export function createStore(initialState, reducer, middlewares = []) {
    let state = initialState;
    const listeners = [];
    function getState() {
        return state;
    }

    function baseDispatch(action) {
        const nextState = reducer(state, action);
        if (nextState !== state) {
            state = nextState;
            listeners.forEach((listener) => {
                listener();
            });
        }
        return action;
    }

    const store = {
        getState,
        dispatch: baseDispatch,
        subscribe(listener) {
            listeners.push(listener);
            return function unsubscribe() {
                const index = listeners.indexOf(listener);
                if (index !== -1) {
                    listeners.splice(index, 1);
                }
            };
        }
    };

    const dispatchWithMiddleware = middlewares.slice().reverse().reduce((next, middleware) => 
        middleware(store)(next), baseDispatch
    );
    store.dispatch = dispatchWithMiddleware;
    return store;
}

export function loadSavedState(initialState) {
    try {
        const savedState = localStorage.getItem("movie-library-state");
        if (!savedState) {
            return initialState;
        }

        const parsedState = JSON.parse(savedState);
        return {
            ...initialState,
            ...parsedState,
            route: initialState.route,
            movies: Array.isArray(parsedState.movies) ? parsedState.movies : initialState.movies,
            settings: {
                ...initialState.settings,
                ...parsedState.settings
            },
            loading: false,
            error: null
        };
    } catch (error) {
        console.error("Unable to load saved state:", error);
        return initialState;
    }
}
