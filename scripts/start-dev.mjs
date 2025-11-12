// scripts/start-dev.mjs
import { spawn } from "child_process";
import path from "path";

const rootDir = process.cwd();
const backendDir = path.join(rootDir, "backend");
const frontendDir = path.join(rootDir, "frontend");

function runCommand(command, args, cwd, name) {
  // Build a single shell command string to avoid DEP0190
  const fullCommand = [command, ...args].join(" ");

  const proc = spawn(fullCommand, {
    cwd,
    stdio: "inherit",
    shell: true, // ok now because we're not passing args separately
  });

  proc.on("close", (code) => {
    if (code !== 0) {
      console.log(`❌ ${name} process exited with code ${code}`);
    }
  });

  proc.on("error", (err) => {
    console.error(`💥 Failed to start ${name}:`, err);
  });
}

// Start backend
console.log("🚀 Starting backend...");
runCommand("node", ["backend.js"], backendDir, "Backend");

// Start frontend
console.log("💻 Starting frontend...");
runCommand("npm", ["run", "dev"], frontendDir, "Frontend");
