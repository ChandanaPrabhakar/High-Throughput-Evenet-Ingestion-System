import fastify from "./server/http.js";
import routes from "./server/routes.js";

fastify.register(routes);

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log("Server running on port 3000");
});
