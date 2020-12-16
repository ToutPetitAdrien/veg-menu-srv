import { initRabbit } from "./rabbitmq/index.ts";
import { initAlgolia } from "./algolia/index.ts";
import { initRedis } from "./redis/index.ts";

async function execScript(scriptPath: string) {
  const script = await import(scriptPath);
  await Promise.all([initRedis(), initRabbit(), initAlgolia()]);
  await script.main();
}

async function init() {
  const scriptName = Deno.args[0];
  return execScript(`./scripts/${scriptName}.ts`);
}

init();
