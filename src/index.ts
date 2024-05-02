import Fastify from "fastify";
import ourDbConnector from "./our-db-connector";
import authRoutes from "./routes/auth";
import fastifyStatic from "@fastify/static";
import "dotenv/config";
import path = require("path");
import cors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/public/",
});

fastify.register(ourDbConnector);
fastify.register(authRoutes);
fastify.register(cors, {});

fastify.get("/", (_request, reply) => {
  return reply.sendFile("index.html");
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
