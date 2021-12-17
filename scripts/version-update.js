#!/bin/node
const fs = require("fs");
const path = require("path");

(() => {
    const version = fs.readFileSync(path.join(__dirname, "..", ".version")).toString().trim();
    console.log(`[i] Updating package.json versions to ${version}...`);

    const backendPackage = require("../backend/package.json");
    const frontendPackage = require("../frontend/package.json");

    backendPackage.version = version;
    frontendPackage.version = version;

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
})();
