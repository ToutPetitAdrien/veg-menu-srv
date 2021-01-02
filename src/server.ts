import { Application, log, oakCors } from "../deps.ts";

const { PORT } = Deno.env.toObject();

(async () => {
  try {
    const [app, ...rest] = await Promise.all(
      [initHttp()],
    );
    app.addEventListener("listen", ({ hostname, port, secure }) => {
      log.info(
        `Listening on: ${secure ? "https://" : "http://"}${hostname ??
          "localhost"}:${port}`,
      );
    });
    app.listen({ port: +PORT });
  } catch (error) {
    log.error(error);
    log.error(`Could not init server`);
  }
})();

export async function initHttp() {
  const app = new Application();

  app.use(
    oakCors({
      origin: "*",
      credentials: true,
      allowedHeaders:
        "Authorization, Origin, X-Requested-With, Content-Type, Accept",
    }),
  );
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.response.body = {
        type: err.message || "",
        original: err,
      };
      ctx.response.status = err.status || 500;
    }
  });
  // Logger
  app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    log.info(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
  });
  return app;
}
