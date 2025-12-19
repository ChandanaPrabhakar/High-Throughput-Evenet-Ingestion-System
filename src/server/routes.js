import PartitionManager from "../log/partition.js";

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
}
