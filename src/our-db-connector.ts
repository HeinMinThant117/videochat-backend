import fastifyPlugin from "fastify-plugin";
import fastifyMongodb from "@fastify/mongodb";
import { FastifyInstance } from "fastify";

async function dbConnector(fastify: FastifyInstance) {
  fastify.register(fastifyMongodb, {
    url: "mongodb://localhost:27017/vidchatDB?authSource=admin",
    auth: {
      username: 'root',
      password: 'example'
    }
  });
}

export default fastifyPlugin(dbConnector);
