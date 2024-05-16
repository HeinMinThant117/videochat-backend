import Fastify from "fastify";
import ourDbConnector from "./our-db-connector";
import authRoutes from "./routes/auth";
import fastifyStatic from "@fastify/static";
import path = require("path");
import cors from "@fastify/cors";

const fastify = Fastify({
  logger: process.env.NODE_ENV === "test" ? false : true,
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/public/",
});

fastify.register(ourDbConnector);
fastify.register(authRoutes);
fastify.register(cors, {});

fastify.get("/", (_request, reply) => {
  return reply.status(200).sendFile("index.html");
});

export default fastify;
