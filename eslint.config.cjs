const jest = require("eslint-plugin-jest");

module.exports = [
    {
        files: ["day_18/**/*.test.js"],
        plugins: {
            jest
        },
        languageOptions: {
            globals: jest.environments.globals.globals
        },
        rules: {
            "jest/no-disabled-tests": "warn",
            "jest/no-focused-tests": "error",
            "jest/no-identical-title": "error",
            "jest/valid-expect": "error",
            "jest/valid-title": "warn"
        }
    }
];
