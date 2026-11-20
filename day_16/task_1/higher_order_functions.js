// 1. Pipe - executes functions from left to right
function pipe(...functions) {
    return function (value) {
        return functions.reduce((result, fn) => fn(result), value);
    };
}

// 2. Compose - executes functions from right to left
function compose(...functions) {
    return function (value) {
        return functions.reduceRight((result, fn) => fn(result), value);
    };
}

// 3. Curry - converts a multi-argument function into unary chain
function curry(fn) {
    function curried(args) {
        return function (arg) {
            const allArgs = [...args, arg];
            if (allArgs.length === fn.length) {
                return fn(...allArgs);
            }
            return curried(allArgs);
        };
    }
    return curried([]);
}

// 4. Partial - partially applies some arguments of a function
function partial(fn, ...presetArgs) {
    return function (...remainingArgs) {
        return fn(...presetArgs, ...remainingArgs);
    };
}


// Test functions
const double = x => x * 2;
const addOne = x => x + 1;
const square = x => x * x;
const subtractOne = x => x - 1;

// Test 1: pipe
console.log("PIPE:");
console.log(pipe(double, addOne)(5));
console.log(pipe(addOne, double)(5));
console.log(pipe(square, double)(3));

// Test 2: compose
console.log("\nCOMPOSE:");
console.log(compose(double, addOne)(5));
console.log(compose(addOne, double)(5));
console.log(compose(square, subtractOne)(4));


// Test 3: curry
console.log("\nCURRY:");
console.log(curry((a, b, c) => a + b + c)(1)(2)(3));
console.log(curry((a, b, c) => a * b * c)(2)(3)(4));
console.log(curry((a, b, c) => `${a} ${b} ${c}`)("Hi")("I'm")("Erin"));


// Test 4: partial
console.log("\nPARTIAL:");
console.log(partial((a, b, c) => a + b + c, 1)(2, 3));
console.log(partial((a, b, c) => a * b * c, 2)(3, 4));
console.log(partial((greeting, name) => `${greeting}, ${name}!`, "Hello")("there"));
