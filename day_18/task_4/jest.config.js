const path = require("path");

module.exports = {
    rootDir: path.resolve(__dirname, "../../.."),
    
    testEnvironment: "jsdom",
    testMatch: [
        "<rootDir>/phase-1-week-4/day_18/task_4/tests/**/*.test.js"
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
    collectCoverageFrom: [
        "day_5/five-page-website/js/components/darkMode.js",
        "phase-1-week-3/day_14/task_5/weather.js",
        "phase-1-week-3/day_14/task_5/weatherApi.js"
    ],
    coverageDirectory: "phase-1-week-4/day_18/task_4/coverage",
    coverageReporters: ["text", "html"],
    coverageProvider: "v8"
};
