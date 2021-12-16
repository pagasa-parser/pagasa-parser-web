module.exports = {

    globals: {
        "ts-jest": {
            useESM: true,
        },
    },
    preset: "ts-jest",
    transform: {
        "\\.m?[tj]sx?$": "ts-jest"
    },
    testRegex: "(/tests/)(.*?)(Tests?)(\\.[jt]s)$",
    testPathIgnorePatterns: [
        "ignore-",
        "disabled-"
    ],
    moduleFileExtensions: ["ts", "js"]

};
