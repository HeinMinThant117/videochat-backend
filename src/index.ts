import Fastify from "fastify";
import firstRoute from "./our-first-route";
import ourDbConnector from "./our-db-connector";
import authRoutes from "./routes/auth";
import "dotenv/config";

const fastify = Fastify({
  logger: true,
});

fastify.register(ourDbConnector);
fastify.register(authRoutes);

async function start() {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
