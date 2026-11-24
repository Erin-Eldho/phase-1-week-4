module.exports = {
    testEnvironment: "node",
    testMatch: [
        "**/*.test.js"
    ],

    collectCoverage: true,
    collectCoverageFrom: [
        "utilities.js"
    ],

    coverageDirectory: "coverage",
    coverageReporters: [
        "text",
        "html"
    ]
};
