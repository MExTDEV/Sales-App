const { spawn } = require("child_process");

const port = process.env.PORT || 3000;

const app = spawn("node_modules/.bin/next", ["start", "-p", port], {
  stdio: "inherit",
  shell: true,
});

app.on("exit", (code) => {
  process.exit(code ?? 0);
});
