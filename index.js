import fastify from "fastify";
import fastifyIO from "fastify-socket.io";

const server = fastify();
server.register(fastifyIO, {
  cors: {
    origin: "*",
  },
});

server.get("/", (req, res) => {
  server.io.emit("hello");
});

server.ready().then(() => {
  server.io.on("connection", (socket) => {
    console.log("a user connected");
  });
});

server.listen({ port: 3000 });
