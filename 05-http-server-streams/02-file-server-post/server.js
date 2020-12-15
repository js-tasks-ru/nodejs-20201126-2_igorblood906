const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");
const LimitSizeStream = require("./LimitSizeStream");
const LimitExceededError = require("./LimitExceededError");

const server = new http.Server();

server.on("request", (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, "files", pathname);

  switch (req.method) {
    case "POST":
      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end("File already exists");
        return;
      }
      if (pathname.includes("/")) {
        res.statusCode = 400;
        res.end("Subfolders are not supported");
        return;
      }

      const limitStream = new LimitSizeStream({ limit: 2 ** 20 });
      const ws = fs.createWriteStream(filepath);

      ws.on("finish", () => {
        res.statusCode = 201;
        res.end("File has been created");
      });

      ws.on("error", (err) => {
        res.statusCode = 500;
        res.end("Internal server error");
      });

      limitStream.on("end", () => {
        ws.end();
      });

      limitStream.on("error", () => {
        ws.destroy();
        fs.unlink(filepath, (err) => {
          if (err) {
            res.statusCode = 500;
            res.end("Internal server error");
          } else {
            res.statusCode = 413;
            res.end("File is too big");
          }
        });
      });

      req.pipe(limitStream).pipe(ws);

      req.on("end", () => {
        limitStream.end();
      });

      req.on("close", () => {
        if (!ws.writableFinished) {
          ws.destroy();
          limitStream.destroy();
          fs.unlink(filepath, () => {});
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

module.exports = server;
