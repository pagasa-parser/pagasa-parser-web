const path = require("path");
module.exports = {
    backendPackagePath: path.resolve(__dirname, "..", "backend", "package.json"),
    frontendPackagePath: path.resolve(__dirname, "..", "frontend", "package.json"),
    backendPackageLockPath: path.resolve(__dirname, "..", "backend", "package-lock.json"),
    frontendPackageLockPath: path.resolve(__dirname, "..", "frontend", "package-lock.json"),
};
