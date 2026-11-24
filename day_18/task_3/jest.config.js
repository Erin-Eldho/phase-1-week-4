module.exports = {
    testEnvironment: "node",

    testMatch: [
        "**/*.test.js"
    ],

    collectCoverage: true,
    collectCoverageFrom: [
        "async_tests.js"
    ],

    coverageDirectory: "coverage",
    coverageReporters: [
        "text",
        "html"
    ]
};
