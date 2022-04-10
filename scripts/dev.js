const child_process = require("child_process");
const path = require("path");

(async () => {

    const npm = process.platform.startsWith("win") ? "npm.cmd" : "npm";
    const frontend = child_process.spawn(npm, ["run", "dev", "--workspace=frontend"], {
        cwd: path.resolve(__dirname, ".."),
        env: process.env,
        stdio: ["ignore", "pipe", "pipe"]
    });
    const backend = child_process.spawn(npm, ["run", "dev", "--workspace=backend"], {
        cwd: path.resolve(__dirname, ".."),
        env: process.env,
        stdio: ["ignore", "pipe", "pipe"]
    });

    frontend.stdout.on("data", (data) => {
        data.toString().trimEnd().split(/\n/g).forEach(line => console.log("[f] " + line));
    });
    frontend.stderr.on("data", (data) => {
        data.toString().trimEnd().split(/\n/g).forEach(line => console.error("[f] " + line));
    });

    backend.stdout.on("data", (data) => {
        data.toString().trimEnd().split(/\n/g).forEach(line => console.log("[b] " + line));
    });
    backend.stderr.on("data", (data) => {
        data.toString().trimEnd().split(/\n/g).forEach(line => console.error("[b] " + line));
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
