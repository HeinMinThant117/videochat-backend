import fastify from "fastify";
import fastifyIO from "fastify-socket.io";

const server = fastify();
server.register(fastifyIO, {
  cors: {
    origin: "*",
  },
});

server.get("/", (req, res) => {
  res.send({ hello: "world" });
});

server.ready().then(() => {
  server.io.on("connection", (socket) => {
    console.log("A user connected.");
    socket.on("offer", (msg) => {
      socket.broadcast.emit("offer", msg);
    });
    socket.on("answer", (msg) => {
      socket.broadcast.emit("answer", msg);
    });
    socket.on("candidate", (msg) => {
      socket.broadcast.emit("candidate", msg);
    });
    socket.on("ready", (msg) => {
      socket.broadcast.emit("ready", msg);
    });
    socket.on("bye", (msg) => {
      socket.broadcast.emit("bye", msg);
    });
  });
});

server.listen({ port: 3000 });
