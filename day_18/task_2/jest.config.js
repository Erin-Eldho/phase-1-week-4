module.exports = {
    testEnvironment: "node",

    testMatch: [
        "**/*.test.js"
    ],

    collectCoverage: true,
    collectCoverageFrom: [
        "mock_functions.js"
    ],

    coverageDirectory: "coverage",
    coverageReporters: [
        "text",
        "html"
    ]
};
