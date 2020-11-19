import { initRabbit } from "./rabbitmq/index.ts";
import * as log from "https://deno.land/std@0.76.0/log/mod.ts";

async function execScript(scriptPath: string) {
  const script = await import(scriptPath);
  await Promise.all([initRabbit()]);
  await script.main();
}

async function init() {
  const scriptName = Deno.args[0];
  return execScript(`./scripts/${scriptName}.ts`);
}

init();
