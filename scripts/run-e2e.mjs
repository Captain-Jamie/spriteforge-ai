import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const port = 3000;
const baseUrl = `http://localhost:${port}`;
const testEnv = {
  ...process.env,
  MOCK_IMAGE_GENERATION: "true"
};

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--port", String(port)], {
  env: testEnv,
  shell: false,
  stdio: "inherit"
});

let exitCode = 1;

try {
  await waitForServer(baseUrl);

  exitCode = await runCommand(process.execPath, ["node_modules/@playwright/test/cli.js", "test"]);
} finally {
  await stopProcessTree(server.pid);
}

process.exit(exitCode);

async function waitForServer(url) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 60_000) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      // Retry until the dev server is ready.
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function runCommand(command, args, stdio = "inherit") {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      env: testEnv,
      shell: false,
      stdio
    });

    child.on("exit", (code) => resolve(code ?? 1));
  });
}

function stopProcessTree(pid) {
  if (!pid) {
    return Promise.resolve();
  }

  if (process.platform === "win32") {
    return runCommand("taskkill", ["/PID", String(pid), "/T", "/F"], "ignore");
  }

  try {
    process.kill(pid, "SIGTERM");
  } catch {
    // Process is already stopped.
  }

  return Promise.resolve();
}
