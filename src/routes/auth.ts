import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface LoginUser {
  email: string;
  password: string;
}

interface RegisterUser {
  email: string;
  username: string;
  password: string;
}

async function routes(fastify: FastifyInstance) {
  const userCollection = fastify.mongo.db?.collection("users");

  fastify.post<{ Body: LoginUser }>("/login", async (request, reply) => {
    const { email, password } = request.body;
    const findUser = await userCollection?.findOne({ email });
    if (!findUser) {
      return reply.code(404).send({ error: "User not found" });
    }

    const result = await bcrypt.compare(password, findUser.password);
    if (!result) {
      return reply.code(401).send({ error: "Invalid email or password" });
    }

    const jwtToken = jwt.sign(
      {
        id: findUser._id,
      },
      "8gGDNV6fKU7N6DY%"
    );

    return {
      message: "Success",
      user: {
        token: jwtToken,
        id: findUser._id,
        username: findUser.username,
        emal: findUser.email,
      },
    };
  });

  fastify.post<{ Body: RegisterUser }>("/register", async (request, reply) => {
    const { username, email, password } = request.body;
    const findUser = await userCollection?.findOne({ email });
    if (findUser) {
      return reply.code(409).send({ error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await userCollection?.insertOne({
      username,
      email,
      password: passwordHash,
    });

    return {
      id: result?.insertedId,
      email,
      username,
    };
  });
}

export default routes;
