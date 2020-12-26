import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import * as log from "https://deno.land/std@0.82.0/log/mod.ts";

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
