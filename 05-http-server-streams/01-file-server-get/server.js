const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");

const server = new http.Server();

server.on("request", (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, "files", pathname);

  switch (req.method) {
    case "GET":
      send(res, pathname, filepath);
      break;

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});
function send(res, pathname, filepath) {
  if (pathname.includes("/")) {
    res.statusCode = 400;
    res.end("Subfolders are not supported");

    return;
  }

  fs.stat(filepath, (error, stats) => {
    if (error || !stats.isFile()) {
      res.statusCode = 404;
      res.end("File not found");

      return;
    }

    const rs = new fs.ReadStream(filepath);

    rs.on("error", () => {
      res.statusCode = 500;
      res.end("Something went wrong");
    });

    rs.pipe(res);

    res.on("close", () => {
      rs.destroy();
    });
  });
}

module.exports = server;
