import * as log from "https://deno.land/std@0.79.0/log/mod.ts";

import { initRabbit } from "./rabbitmq.ts";
import { initAlgolia } from "./algolia.ts";
import { initRedis } from "./redis.ts";

import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import * as log from "https://deno.land/std@0.79.0/log/mod.ts";

const { PORT } = Deno.env.toObject();

(async () => {
  try {
    const [app, ...rest] = await Promise.all(
      [initHttp(), initRedis(), initRabbit(), initAlgolia()],
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
