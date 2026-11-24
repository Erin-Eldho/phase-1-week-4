const path = require("path");

module.exports = {
    rootDir: path.resolve(__dirname, "../../.."),
    testEnvironment: "jsdom",
    testMatch: [
        "<rootDir>/phase-1-week-4/day_18/task_5/tests/**/*.test.js"
    ],

    transform: {
        "^.+\\.js$": [
            "babel-jest",
            {
                configFile: path.resolve(__dirname, "babel.config.cjs")
            }
        ]
    },

    collectCoverage: true,
    coverageProvider: "v8",
    collectCoverageFrom: [
        "day_5/five-page-website/js/form_validator.js",
        "day_5/five-page-website/js/components/accordion.js",
        "day_5/five-page-website/js/components/nav.js"
    ],

    coverageDirectory: "phase-1-week-4/day_18/task_5/coverage",
    coverageReporters: ["text", "html"]
};
