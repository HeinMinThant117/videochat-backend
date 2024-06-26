import { FastifyInstance } from "fastify";

interface AnimalParams {
  animal: string;
}

async function routes(fastify: FastifyInstance) {
  const collection = fastify.mongo.db?.collection("test_collection");

  fastify.get("/", async () => {
    return { hello: "world" };
  });

  fastify.get("/animals", async () => {
    const result = await collection?.find().toArray();
    if (result?.length === 0) {
      throw new Error("No documents found");
    }
    return result;
  });

  fastify.get<{ Params: AnimalParams }>("/animals/:animal", async (request) => {
    const result = await collection?.findOne({
      animal: request.params.animal,
    });
    if (!result) {
      throw new Error("Invalid value");
    }

    return result;
  });

  const animalBodyJsonSchema = {
    type: "object",
    required: ["animal"],
    properties: {
      animal: { type: "string" },
    },
  };

  const schema = {
    body: animalBodyJsonSchema,
  };

  fastify.post<{ Body: AnimalParams }>(
    "/animals",
    { schema },
    async (request) => {
      const result = await collection?.insertOne({
        animal: request.body.animal,
      });
      return result;
    }
  );
}

export default routes;
