import fastifyPlugin from "fastify-plugin";
import fastifyMongodb from "@fastify/mongodb";
import { FastifyInstance } from "fastify";

async function dbConnector(fastify: FastifyInstance) {
  fastify.register(fastifyMongodb, {
    // url: process.env.MONGODB_URI,
    // auth: {
    // username: process.env.MONGODB_USERNAME,
    // password: process.env.MONGODB_PASSWORD,
    // },
    url: "mongodb://localhost:27017/vidchatDB?authSource=admin",
    auth: {
      username: "root",
      password: "example",
    },
  });
}

export default fastifyPlugin(dbConnector);
