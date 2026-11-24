// 1. CHUNK - splits an array into smaller arrays of a given size
function chunk(array, size) {
    if (!Array.isArray(array)) {
        throw new TypeError("The first argument must be an array");
    }
    if (!Number.isInteger(size) || size <= 0) {
        throw new RangeError("Chunk size must be a positive integer");
    }
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}


// 2. ZIP - combines two arrays into pairs
function zip(firstArray, secondArray) {
    if (!Array.isArray(firstArray) || !Array.isArray(secondArray)) {
        throw new TypeError("Both arguments must be arrays");
    }
    const result = [];
    const length = Math.min(firstArray.length, secondArray.length);
    for (let i = 0; i < length; i++) {
        result.push([firstArray[i], secondArray[i]]);
    }
    return result;
}


// 3. GROUPBY - groups array elements using a callback or property name
function groupBy(array, iteratee) {
    if (!Array.isArray(array)) {
        throw new TypeError("The first argument must be an array");
    }
    if (typeof iteratee !== "function" && typeof iteratee !== "string") {
        throw new TypeError("The second argument must be a function or property name");
    }
    const result = {};
    for (const item of array) {
        const key = typeof iteratee === "function" ? iteratee(item) : item[iteratee];
        const groupKey = String(key);
        if (!Object.prototype.hasOwnProperty.call(result, groupKey)) {
            Object.defineProperty(result, groupKey, {
                value: [],
                enumerable: true,
                writable: true,
                configurable: true
            });
        }
        result[groupKey].push(item);
    }
    return result;
}


// 4. PIPE - executes functions from left to right
function validateFunctions(functions) {
    for (const fn of functions) {
        if (typeof fn !== "function") {
            throw new TypeError("All arguments must be functions");
        }
    }
}

function pipe(...functions) {
    validateFunctions(functions);
    return function (value) {
        return functions.reduce((result, fn) => fn(result), value);
    };
}


// 5. COMPOSE - executes functions from right to left
function compose(...functions) {
    validateFunctions(functions);
    return function (value) {
        return functions.reduceRight((result, fn) => fn(result), value);
    };
}


// 6. CURRY - converts a multi-argument function into a chain of calls
function curry(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("The argument must be a function");
    }
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        }
        return function (...nextArgs) {
            return curried(...args, ...nextArgs);
        };
    };
}


// 7. PARTIAL - partially applies some arguments of a function
function partial(fn, ...presetArgs) {
    if (typeof fn !== "function") {
        throw new TypeError("The first argument must be a function");
    }
    return function (...remainingArgs) {
        return fn(...presetArgs, ...remainingArgs);
    };
}


module.exports = {
    chunk,
    zip,
    groupBy,
    pipe,
    compose,
    curry,
    partial
};
