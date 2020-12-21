import * as log from "https://deno.land/std@0.76.0/log/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

import { initRabbit } from "./rabbitmq/index.ts";
import { initAlgolia } from "./algolia/index.ts";
import { initRedis } from "./redis/index.ts";
import { initHttp } from "./http/index.ts";

const { PORT } = config({ safe: true });

Promise.all([initHttp(), initRedis(), initRabbit(), initAlgolia()])
  .then(([app]) => {
    app.addEventListener("listen", ({ hostname, port, secure }) => {
      log.info(
        `Listening on: ${secure ? "https://" : "http://"}${
          hostname ?? "localhost"
        }:${port}`
      );
    });
    app.listen({ port: +PORT });
  })
  .catch((error) => {
    log.error(error)
    log.error(`Could not init server`)
  })
