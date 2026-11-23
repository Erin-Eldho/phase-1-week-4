// 1. EVENT EMITTER
class EventEmitter {
    constructor() {
        this.events = {};
    }
    // Register a listener for an event
    on(event, listener) {
        if (typeof listener !== "function") {
            throw new TypeError("Listener must be a function");
        }
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return this;
    }
    // Emit an event and pass arguments to its listeners
    emit(event, ...args) {
        const listeners = this.events[event];
        if (!listeners || listeners.length === 0) {
            return false;
        }
        listeners.forEach(listener => {
            listener(...args);
        });
        return true;
    }
}


// 2. FETCH JSON
async function fetchJSON(url) {
    const response = await global.fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}


// 3. RETRY LOGIC
// maxAttempts represents the total number of attempts, including the initial call.
async function retry(operation, maxAttempts = 2) {
    if (typeof operation !== "function") {
        throw new TypeError("Operation must be a function");
    }
    if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
        throw new RangeError("Maximum attempts must be a positive integer");
    }
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError;
}


module.exports = {
    EventEmitter,
    fetchJSON,
    retry
};
