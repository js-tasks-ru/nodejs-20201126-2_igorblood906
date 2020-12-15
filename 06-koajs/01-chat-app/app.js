const path = require("path");
const Koa = require("koa");
const app = new Koa();

app.use(require("koa-static")(path.join(__dirname, "public")));
app.use(require("koa-bodyparser")());

const Router = require("koa-router");
const router = new Router();
const clients = new Set();

router.get("/subscribe", async (ctx, next) => {
  ctx.body = await new Promise((resolve) => {
    clients.add(resolve);
  });
});

router.post("/publish", async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message) ctx.throw(400);

  clients.forEach((resolve) => {
    resolve(message);
  });

  clients.clear();
  ctx.body = "done";
});

app.use(router.routes());

module.exports = app;
