import PartitionManager from "../log/partition.js";
import Consumer from "../core/consumer.js";

const MAX_IN_FLIGHT = 1000;

export default async function (fastify) {
  const pm = new PartitionManager(3);
  let inFlight = 0;

  fastify.post("/produce", async (request, reply) => {
    inFlight++;

    if (inFlight > MAX_IN_FLIGHT) {
      inFlight--;
      reply.code(429).send({ error: "Backpressure: try later" });
      return;
    }

    const { key, value } = request.body;

    try {
      //   await new Promise((resolve) => setTimeout(resolve, 150));

      await pm.append(key, { key, value, ts: Date.now() });
      reply.send({ status: "ok" });
    } catch (err) {
      reply.code(500).send({ error: "write failed" });
    } finally {
      inFlight--;
    }
  });

  fastify.get("/consume", async (request, reply) => {
    const { partition, offset } = request.query;

    if (partition === undefined || offset === undefined) {
      reply.code(400).send({ error: "partition and offset required" });
      return;
    }

    const consumer = new Consumer(Number(partition));
    const result = await consumer.poll(Number(offset));

    reply.send(result);
  });
}
