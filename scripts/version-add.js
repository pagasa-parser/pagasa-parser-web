const {
    backendPackagePath,
    backendPackageLockPath,
    frontendPackagePath,
    frontendPackageLockPath
} = require("./versions.js");
const child_process = require("child_process");

(() => {
    console.log("[i] Adding extra version files...");

    console.log(
        child_process.spawnSync("git", [
            "add",
            backendPackagePath, backendPackageLockPath,
            frontendPackagePath, frontendPackageLockPath
        ]).stdout.toString("utf8")
    );

    console.log("[i] Amending commit...");
    console.log(
        child_process.spawnSync("git", [
            "commit", "--amend", "--no-edit"
        ]).stdout.toString("utf8")
    );
})();
