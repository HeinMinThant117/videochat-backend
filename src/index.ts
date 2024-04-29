import Fasitfy, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";

const server: FastifyInstance = Fasitfy({});

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          pong: {
            type: "string",
          },
        },
      },
    },
  },
};

server.get("/ping", opts, async (request, reply) => {
  return { pong: "pong" };
});

const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log(`Server is listening on PORT 3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
