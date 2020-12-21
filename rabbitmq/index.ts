import { AmqpChannel, connect } from "https://deno.land/x/amqp/mod.ts";
import * as log from "https://deno.land/std@0.76.0/log/mod.ts";
import { Queue } from "../types.ts";
import * as fs from "https://deno.land/std@0.76.0/fs/mod.ts";

const { CLOUDAMQP_URL } = Deno.env.toObject();

let channel: AmqpChannel;

async function initTopology(): Promise<void> {
  if (!channel) {
    throw new Error("Call initRabbit first");
  }
  console.log("coucou8");

  for (const queue of Object.values(Queue)) {
    console.log("coucou9");
    await channel.declareQueue({ queue, durable: true });
  }
}

export async function initRabbit(): Promise<void> {
  console.log("coucou0");
  const conn = await connect(CLOUDAMQP_URL);
  channel = await conn.openChannel();

  console.log("coucou1");

  await initTopology();

  let workerPaths: Array<string> = [];
  for (const file of fs.expandGlobSync("workers/**/*.ts")) {
    workerPaths = [...workerPaths, file.path];
    console.log("coucou2");
  }

  const workers = workerPaths.map(async (p: string) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const worker = await import(p);
    console.log("coucou3");

    const workerShortName = p.match(/\/(workers\/[^/]+\.ts$)/)![1];

    if (!worker.queue) {
      throw new Error(
        `Missing export {yellow queue} in worker {yellow ${workerShortName}}`,
      );
    }

    if (!worker.work) {
      throw new Error(
        `Missing export {yellow work} in worker {yellow ${workerShortName}}`,
      );
    }

    return worker;
  });

  console.log('coucou4')

  for await (const worker of workers) {
    await channel.consume(
      { queue: worker.queue },
      async (args, props, data) => {
        log.info(
          `Handling message from queue: ${worker.queue}, data: ${
            new TextDecoder().decode(data)
          }...`,
        );
        try {
          await worker.work(JSON.parse(new TextDecoder().decode(data)));
          await channel.ack({ deliveryTag: args.deliveryTag });
          log.info(
            `Handled message from queue: ${worker.queue}, data: ${
              new TextDecoder().decode(data)
            }, message is acked`,
          );
        } catch (error) {
          log.error(error);
          log.error(
            `Error while handling message from queue: ${worker.queue}, data: ${
              new TextDecoder().decode(data)
            }, message is nacked`,
          );
          return channel.nack({ deliveryTag: args.deliveryTag });
        }
      },
    );
  }
}

export async function sendToQueue(
  queue: Queue,
  message: unknown,
): Promise<void> {
  if (!channel) {
    throw new Error("Call initRabbit first");
  }

  await channel.publish(
    { routingKey: queue },
    { contentType: "application/json" },
    new TextEncoder().encode(JSON.stringify(message)),
  );
}
