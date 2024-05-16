import fastifyPlugin from "fastify-plugin";
import fastifyMongodb from "@fastify/mongodb";
import { FastifyInstance } from "fastify";

async function dbConnector(fastify: FastifyInstance) {
  fastify.register(fastifyMongodb, {
    url:
      process.env.NODE_ENV === "test"
        ? process.env.MONGODB_TEST_URI
        : process.env.MONGODB_URI,
    auth: {
      username:
        process.env.NODE_ENV === "test"
          ? process.env.MONGODB_USERNAME
          : process.env.MONGODB_TEST_USERNAME,
      password:
        process.env.NODE_ENV === "test"
          ? process.env.MONGODB_PASSWORD
          : process.env.MONGODB_TEST_PASSWORD,
    },
  });
}

export default fastifyPlugin(dbConnector);
