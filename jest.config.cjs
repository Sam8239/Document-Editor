module.exports = {
    testEnvironment: "jest-environment-jsdom",
    transform: {
        "^.+\\.js$": "babel-jest", // Ensures Jest uses Babel for JS files
    },
    moduleNameMapper: {
        "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js",
    },
    transformIgnorePatterns: ["/node_modules/"],
};
