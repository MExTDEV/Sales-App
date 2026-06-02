const next = require("next");
const http = require("http");

const port = parseInt(process.env.PORT || "3001", 10);
const hostname = "0.0.0.0";

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((req, res) => {
    handle(req, res);
  }).listen(port, hostname, () => {
    console.log(`MExT Sales App running on http://${hostname}:${port}`);
  });
});