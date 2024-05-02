import Fastify from "fastify";
import ourDbConnector from "./our-db-connector";
import authRoutes from "./routes/auth";
import "dotenv/config";

const fastify = Fastify({
  logger: true,
});

fastify.register(ourDbConnector);
fastify.register(authRoutes);

fastify.get("/", () => {
  console.log("ENV : ", process.env.JWT_SECRET);
  return { hello: "world" };
});

async function start() {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
