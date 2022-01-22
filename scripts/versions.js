const path = require("path");
module.exports = {
    backendPackagePath: path.resolve("../backend/package.json"),
    frontendPackagePath: path.resolve("../frontend/package.json"),
    backendPackageLockPath: path.resolve("../backend/package-lock.json"),
    frontendPackageLockPath: path.resolve("../frontend/package-lock.json"),
};
