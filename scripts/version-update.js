#!/bin/node
const fs = require("fs");
const path = require("path");

const packageInfo = require("../package.json");

const {
    backendPackagePath,
    backendPackageLockPath,
    frontendPackagePath,
    frontendPackageLockPath
} = require("./versions.js");

(() => {
    const version = packageInfo.version;
    console.log(`[i] Updating package.json versions to ${version}...`);

    const backendPackage = require(backendPackagePath);
    const frontendPackage = require(frontendPackagePath);
    const backendPackageLock = require(backendPackageLockPath);
    const frontendPackageLock = require(frontendPackageLockPath);

    backendPackage.version = version;
    frontendPackage.version = version;
    backendPackageLock.version = version;
    frontendPackageLock.version = version;

    fs.writeFileSync(
        path.join(__dirname, "..", "backend", "package.json"),
        JSON.stringify(backendPackage, null, 4)
    );
    console.log("[i] Set version of backend package.json");
    fs.writeFileSync(
        path.join(__dirname, "..", "frontend", "package.json"),
        JSON.stringify(frontendPackage, null, 4)
    );
    console.log("[i] Set version of frontend package.json");

    console.log(`[i] Updating package-lock.json versions to ${version}...`);
    fs.writeFileSync(
        path.join(__dirname, "..", "backend", "package-lock.json"),
        JSON.stringify(backendPackageLock, null, 4)
    );
    console.log("[i] Set version of backend package-lock.json");
    fs.writeFileSync(
        path.join(__dirname, "..", "frontend", "package-lock.json"),
        JSON.stringify(frontendPackageLock, null, 4)
    );
    console.log("[i] Set version of frontend package-lock.json");
})();
