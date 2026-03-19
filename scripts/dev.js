import { exec } from "node:child_process";
import { spawn } from "node:child_process";

const DEV_URL = process.env.DEV_URL || "http://localhost:3000";
let hasOpenedBrowser = false;

const clientProcess = spawn(
  "npm",
  ["--prefix", "./client", "start"],
  {
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
    shell: true,
  }
);

const serverProcess = spawn("npm", ["run", "server"], {
  env: process.env,
  stdio: ["inherit", "inherit", "inherit"],
  shell: true,
});

const prefixOutput = (stream, label, writer, onChunk) => {
  let buffered = "";

  stream.on("data", (chunk) => {
    const text = chunk.toString();
    if (onChunk) {
      onChunk(text);
    }

    buffered += text;
    const lines = buffered.split(/\r?\n/);
    buffered = lines.pop() || "";

    for (const line of lines) {
      writer.write(`[${label}] ${line}\n`);
    }
  });

  stream.on("end", () => {
    if (buffered) {
      writer.write(`[${label}] ${buffered}\n`);
    }
  });
};

const openBrowser = () => {
  if (hasOpenedBrowser) {
    return;
  }

  hasOpenedBrowser = true;

  const commands = {
    win32: `start "" "${DEV_URL}"`,
    darwin: `open "${DEV_URL}"`,
    linux: `xdg-open "${DEV_URL}"`,
  };

  const command = commands[process.platform] || commands.linux;

  exec(command, (error) => {
    if (error) {
      console.log(`Unable to open a browser automatically. Open ${DEV_URL} manually.`);
      return;
    }

    console.log(`Opened ${DEV_URL} in your default browser.`);
  });
};

const waitForClient = setInterval(async () => {
  if (hasOpenedBrowser) {
    clearInterval(waitForClient);
    return;
  }

  try {
    const response = await fetch(DEV_URL);
    if (response.ok) {
      clearInterval(waitForClient);
      openBrowser();
    }
  } catch {
    // Keep polling until the client dev server is ready.
  }
}, 2000);

prefixOutput(clientProcess.stdout, "client", process.stdout, (text) => {
  if (
    text.includes("Compiled successfully") ||
    text.includes("You can now view") ||
    text.includes("webpack compiled successfully")
  ) {
    openBrowser();
    clearInterval(waitForClient);
  }
});
prefixOutput(clientProcess.stderr, "client", process.stderr);

const terminateChildren = () => {
  clearInterval(waitForClient);
  clientProcess.kill("SIGTERM");
  serverProcess.kill("SIGTERM");
};

clientProcess.on("exit", (code) => {
  if (code && code !== 0) {
    clearInterval(waitForClient);
    serverProcess.kill("SIGTERM");
    process.exit(code);
  }
});

serverProcess.on("exit", (code) => {
  if (code && code !== 0) {
    console.log("Server exited early. The client may still be available in the browser.");
  }
});

process.on("SIGINT", () => {
  terminateChildren();
  process.exit(0);
});

process.on("SIGTERM", () => {
  terminateChildren();
  process.exit(0);
});
