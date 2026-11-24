// 1. HTTP ERROR
class HttpError extends Error {
    constructor(status, statusText = "") {
        super(`HTTP Error: ${status} ${statusText}`);
        this.name = "HttpError";
        this.status = status;
        this.statusText = statusText;
    }
}

// 2. FETCH JSON
async function fetchJSON(url) {
    const response = await global.fetch(url);
    // Accept only HTTP 200 for this task
    if (response.status !== 200) {
        throw new HttpError(response.status, response.statusText);
    }
    return await response.json();
}

// 3. DEBOUNCE
function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
}

// 4. MEMOIZE
function memoize(fn) {
    const cache = new Map();
    return function (input) {
        if (cache.has(input)) {
            return cache.get(input);
        }
        const result = fn.call(this, input);
        cache.set(input, result);
        return result;
    };
}

// 5. ABORT CONTROLLER TIMEOUT
async function fetchWithTimeout(url, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);
    try {
        return await global.fetch(url, {
            signal: controller.signal
        });
    } finally {
        clearTimeout(timeoutId);
    }
}

module.exports = {
    HttpError,
    fetchJSON,
    debounce,
    memoize,
    fetchWithTimeout
};
