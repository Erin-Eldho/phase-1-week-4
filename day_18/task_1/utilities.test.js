const {
    chunk,
    zip,
    groupBy,
    pipe,
    compose,
    curry,
    partial
} = require("./utilities");


// 1. CHUNK TESTS
describe("chunk()", () => {
    test("should split an array into chunks of the given size", () => {
        const result = chunk([1, 2, 3, 4, 5], 2);
        expect(result).toEqual([ [1, 2], [3, 4], [5]]);
    });

    test("should return an empty array when the input array is empty", () => {
        const result = chunk([], 2);
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });

    test("should throw a TypeError when the input is not an array", () => {
        expect(() => chunk("123", 2)).toThrow(TypeError);
    });

    test("should throw a RangeError when the chunk size is zero", () => {
        expect(() => chunk([1, 2, 3], 0)).toThrow(RangeError);
    });

    test("should throw a RangeError when the chunk size is not an integer", () => {
        expect(() => chunk([1, 2, 3], 1.5)).toThrow(RangeError);
    });
});


// 2. ZIP TESTS
describe("zip()", () => {
    test("should combine two arrays into pairs", () => {
        const result = zip([1, 2, 3], ["a", "b", "c"]);
        expect(result).toEqual([[1, "a"], [2, "b"], [3, "c"]]);
    });

    test("should stop when the shorter array ends", () => {
        const result = zip([1, 2, 3], ["a", "b"]);
        expect(result).toEqual([[1, "a"], [2, "b"]]);
        expect(result).toHaveLength(2);
        expect(result.map(pair => pair[0])).toContain(1);
    });

    test("should return an empty array when both input arrays are empty", () => {
        const result = zip([], []);
        expect(result).toEqual([]);
        expect(result.length).toBeFalsy();
    });

    test("should throw a TypeError when the first argument is not an array", () => {
        expect(() => zip("123", [1, 2, 3])).toThrow(TypeError);
    });

    test("should throw a TypeError when the second argument is not an array", () => {
        expect(() => zip([1, 2, 3], "abc")).toThrow(TypeError);
    });
});


// 3. GROUPBY TESTS
describe("groupBy()", () => {
    const users = [
        { name: "Erin", role: "admin" },
        { name: "Alee", role: "user" },
        { name: "Delna", role: "admin" }
    ];

    test("should group array elements using a callback function", () => {
        const result = groupBy(users, user => user.role);
        expect(result).toEqual({
            admin: [
                { name: "Erin", role: "admin" },
                { name: "Delna", role: "admin" }
            ],
            user: [
                { name: "Alee", role: "user" }
            ]
        });
    });

    test("should group array elements using a property name", () => {
        const result = groupBy(users, "role");
        expect(result.admin).toHaveLength(2);
        expect(result.user).toHaveLength(1);
        expect(result.admin).toContain(users[0]);
        expect(result.admin).toBeTruthy();
    });

    test("should return an empty object when the input array is empty", () => {
        const result = groupBy([], "role");
        expect(result).toEqual({});
        expect(Object.keys(result)).toHaveLength(0);
    });

    test("should throw a TypeError when the input is not an array", () => {
        expect(() => groupBy("users", "role")).toThrow(TypeError);
    });

    test("should throw a TypeError when the iteratee is invalid", () => {
        expect(() => groupBy(users, 123)).toThrow(TypeError);
    });
});


// 4. PIPE TESTS
describe("pipe()", () => {
    const double = value => value * 2;
    const addOne = value => value + 1;
    
    test("should execute functions from left to right", () => {
        const result = pipe(double, addOne)(5);
        expect(result).toBe(11);
    });

    test("should return the original value when no functions are provided", () => {
        const result = pipe()(10);
        expect(result).toBe(10);
    });

    test("should handle decimal calculations", () => {
        const result = pipe(value => value / 3, value => value * 3)(1);
        expect(result).toBeCloseTo(1);
    });

    test("should throw a TypeError when an argument is not a function", () => {
        expect(() => pipe(double, 10)).toThrow(TypeError);
    });
});


// 5. COMPOSE TESTS
describe("compose()", () => {
    const double = value => value * 2;
    const addOne = value => value + 1;

    test("should execute functions from right to left", () => {
        const result = compose(double, addOne)(5);
        expect(result).toBe(12);
    });

    test("should return the original value when no functions are provided", () => {
        const result = compose()(10);
        expect(result).toBe(10);
    });

    test("should work with a single function", () => {
        const result = compose(double)(5);
        expect(result).toBe(10);
    });

    test("should throw a TypeError when an argument is not a function", () => {
        expect(() => compose(addOne, "invalid")).toThrow(TypeError);
    });
});


// 6. CURRY TESTS
describe("curry()", () => {
    const addThreeNumbers = (a, b, c) => a + b + c;

    test("should convert a multi-argument function into a chain of calls", () => {
        const curriedAdd = curry(addThreeNumbers);
        const result = curriedAdd(1)(2)(3);
        expect(result).toBe(6);
    });

    test("should support passing multiple arguments in one call", () => {
        const curriedAdd = curry(addThreeNumbers);
        const result = curriedAdd(1, 2)(3);
        expect(result).toBe(6);
    });

    test("should execute a function that has no arguments", () => {
        const getValue = curry(() => 42);
        expect(getValue()).toBe(42);
    });

    test("should throw a TypeError when the argument is not a function", () => {
        expect(() => curry(123)).toThrow(TypeError);
    });
});


// 7. PARTIAL TESTS
describe("partial()", () => {
    const addThreeNumbers = (a, b, c) => a + b + c;

    test("should apply preset arguments before the remaining arguments", () => {
        const addFive = partial(addThreeNumbers, 2, 3);
        const result = addFive(4);
        expect(result).toBe(9);
    });

    test("should work without preset arguments", () => {
        const add = partial(addThreeNumbers);
        expect(add(1, 2, 3)).toBe(6);
    });

    test("should allow preset arguments without remaining arguments", () => {
        const add = partial((a, b) => a + b, 5, 10);
        expect(add()).toBe(15);
    });

    test("should throw a TypeError when the first argument is not a function", () => {
        expect(() => partial(123, 1, 2)).toThrow(TypeError);
    });
});
