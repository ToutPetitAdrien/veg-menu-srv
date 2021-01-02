import { initRabbit } from "./rabbitmq.ts";
import { initAlgolia } from "./algolia.ts";

import { redisService } from "./redis.ts";

async function execScript(scriptPath: string) {
  const script = await import(scriptPath);
  const redis = redisService();
  await Promise.all([redis.initRedis(), initRabbit(), initAlgolia()]);
  await script.main();
}

async function init() {
  const jobName = Deno.args[0];
  return execScript(`./jobs/${jobName}.ts`);
}

init();
