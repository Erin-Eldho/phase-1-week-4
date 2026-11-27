module.exports = {
    testEnvironment: "jsdom",
    testMatch: [
        "<rootDir>/tests/**/*.test.js"
    ],

    collectCoverageFrom: [
        "js/router.js",
        "js/store.js"
    ],

    coverageDirectory: "coverage",
    coverageReporters: [
        "text",
        "lcov"
    ],
    
    coverageThreshold: {
        "./js/router.js": {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        },
        "./js/store.js": {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    }
};
