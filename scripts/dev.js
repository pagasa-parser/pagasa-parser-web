const child_process = require("child_process");
const path = require("path");

(async () => {

    const npm = process.platform.startsWith("win") ? "npm.cmd" : "npm";
    const frontend = child_process.spawn(npm, ["run", "dev", "--workspace=frontend"], {
        cwd: path.resolve(__dirname, ".."),
        env: process.env,
        stdio: "inherit"
    });
    const backend = child_process.spawn(npm, ["run", "dev", "--workspace=backend"], {
        cwd: path.resolve(__dirname, ".."),
        env: process.env,
        stdio: "inherit"
    });

    const termination = Promise.all([
        new Promise((res, rej) => {
            frontend.on("exit", (code) => {
                console.log(`[i] Frontend server closed (exit code: ${code})`);
                res();
            });
            frontend.on("error", rej);
        }),
        new Promise((res, rej) => {
            backend.on("exit", (code) => {
                console.log(`[i] Backend server closed (exit code: ${code})`);
                res();
            });
            backend.on("error", rej);
        }),
    ]);

    async function cleanup() {
        frontend.kill();
        backend.kill();
        await termination;
    }

    process.on("exit", cleanup);
    process.on("SIGINT", cleanup);
    process.on("SIGUSR1", cleanup);
    process.on("SIGUSR2", cleanup);
    process.on("uncaughtException", cleanup);

    await termination;

})();
