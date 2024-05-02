import fastifyPlugin from "fastify-plugin";
import fastifyMongodb from "@fastify/mongodb";
import { FastifyInstance } from "fastify";

async function dbConnector(fastify: FastifyInstance) {
  fastify.register(fastifyMongodb, {
    url: process.env.MONGODB_URI,
    auth: {
      username: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD,
    },
  });
}

export default fastifyPlugin(dbConnector);
