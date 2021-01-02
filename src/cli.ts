import { initRabbit } from "./rabbitmq.ts";
import { initAlgolia } from "./algolia.ts";
import { initRedis } from "./redis.ts";

async function execScript(scriptPath: string) {
  const script = await import(scriptPath);
  await Promise.all([initRedis(), initRabbit(), initAlgolia()]);
  await script.main();
}

async function init() {
  const jobName = Deno.args[0];
  return execScript(`./jobs/${jobName}.ts`);
}

init();
