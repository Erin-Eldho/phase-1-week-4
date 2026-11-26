export function createStore(initialState, reducer) {
    let state = initialState;
    const listeners = [];

    function getState() {
        return state;
    }

    function dispatch(action) {
        const nextState = reducer(state, action);
        if (nextState !== state) {
        state = nextState;
        listeners.forEach((listener) => {
            listener();
        });
        }
    }

    function subscribe(listener) {
        listeners.push(listener);
        return function unsubscribe() {
        const index = listeners.indexOf(listener);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
        };
    }

    return {getState, dispatch, subscribe};
}
