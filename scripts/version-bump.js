#!/bin/node
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

(() => {
    const root = path.resolve(__dirname, "..");

    const unstaged = childProcess.spawnSync(
        "git",
        ["diff-index", "--quiet", "HEAD", "--"],
        {
            cwd: root
        }
    );
    if (unstaged.status !== 0) {
        console.error("[E] Unstaged changes found. Stage your changes first.");
        return;
    }

    const bumpType = (process.argv.slice(2)[0] || "").toLowerCase();

    const allowedLevels = ["major", "minor", "patch", "premajor", "preminor", "prepatch", "prerelease"];
    if (!allowedLevels.includes(bumpType)) {
        console.error("[E] Invalid version bump type. Valid values: " + JSON.stringify(allowedLevels));
        return;
    }

    const oldVersion = fs.readFileSync(path.join(__dirname, "..", ".version")).toString().trim();
    const newVersion = childProcess.spawnSync(
        "npx.cmd", ["--yes", "semver", "-i", bumpType, oldVersion]
    ).stdout.toString("utf8").trim();

    fs.writeFileSync(path.join(__dirname, "..", ".version"), newVersion);

    require("./version-update.js");

    console.log("[i] Making commit...");
    childProcess.spawnSync("git", ["add", "."], { cwd: root });
    childProcess.spawnSync("git", ["commit", "-m", newVersion], { cwd: root })
    childProcess.spawnSync("git", ["tag", `v${newVersion}`], { cwd: root });
    childProcess.spawnSync("git", ["push"], { cwd: root });
    childProcess.spawnSync("git", ["push", "origin", "tag", `v${newVersion}`], { cwd: root });

    console.log("[i] " + newVersion);
})();
