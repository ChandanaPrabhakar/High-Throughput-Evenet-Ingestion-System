import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
  bodyLimit: 1e6,
});

export default fastify;
