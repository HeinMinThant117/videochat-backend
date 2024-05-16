import { FastifyInstance } from "fastify";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { ObjectId } from "@fastify/mongodb";

interface LoginUser {
  email: string;
  password: string;
}

interface RegisterUser {
  email: string;
  username: string;
  password: string;
}

interface JWTUser {
  id: string;
  iat: number;
}

async function routes(fastify: FastifyInstance) {
  const userCollection = fastify.mongo.db?.collection("users");
  const jwtSecret = process.env.JWT_SECRET as jwt.Secret;

  fastify.get("/user", async (request, reply) => {
    const token = request.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const verifyResult = jwt.verify(token, jwtSecret) as JWTUser;

    const user = await userCollection?.findOne({
      _id: ObjectId.createFromHexString(verifyResult.id),
    });

    return {
      user: { id: user._id, email: user.email, username: user.username },
    };
  });

  fastify.post<{ Body: LoginUser }>(
    "/login",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
          required: ["email", "password"],
        },
      },
    },
    async (request, reply) => {
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
        jwtSecret
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
    }
  );

  fastify.post<{ Body: RegisterUser }>(
    "/register",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            username: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
          },
          required: ["username", "email", "password"],
        },
      },
    },
    async (request, reply) => {
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

      const jwtToken = jwt.sign(
        {
          id: result.insertedId.toString(),
        },
        jwtSecret
      );

      return {
        message: "Success",
        user: {
          token: jwtToken,
          id: result.insertedId.toString(),
          username,
          email,
        },
      };
    }
  );
}

export default routes;
