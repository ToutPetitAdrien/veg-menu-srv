import { AmqpChannel, connect } from "https://deno.land/x/amqp/mod.ts";
import * as log from "https://deno.land/std@0.79.0/log/mod.ts";
import { Queue } from "../types.ts";
import * as fs from "https://deno.land/std@0.79.0/fs/mod.ts";

const {
  CLOUDAMQP_URL,
} = Deno.env.toObject();

let channel: AmqpChannel;

async function initTopology(): Promise<void> {
  if (!channel) {
    throw new Error("Call initRabbit first");
  }

  for (const queue of Object.values(Queue)) {
    await channel.declareQueue({ queue, durable: true });
  }
}

export async function initRabbit(): Promise<void> {
  try {
    const conn = await connect(CLOUDAMQP_URL);
    channel = await conn.openChannel();
  } catch (error) {
    return Promise.reject(error);
  }

  await initTopology();

  let workerPaths: Array<string> = [];
  for (const file of fs.expandGlobSync("workers/**/*.ts")) {
    workerPaths = [...workerPaths, file.path];
  }

  const workers = await Promise.all(workerPaths.map(async (p: string) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const worker = await import(p);

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
  }));

  for await (const worker of workers) {
    await channel.consume(
      { queue: worker.queue },
      async (args, props, data) => {
        try {
          await worker.work(JSON.parse(new TextDecoder().decode(data)));
          await channel.ack({ deliveryTag: args.deliveryTag });
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
