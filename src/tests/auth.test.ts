import { Collection, MongoClient } from "mongodb";
import app from "../app";
import "dotenv/config";
import bcrypt from "bcrypt";
import { closeConnection, getCollection, initDB } from "../utils/db-helpers";

let client: MongoClient;
let collection: Collection;

beforeAll(async () => {
  client = await initDB();
  collection = await getCollection("users", client);
});

beforeEach(async () => {
  await collection.deleteMany({});
});

describe("Logging In", () => {
  test("returns 400 with missing credentials", async () => {
    const response1 = await app.inject({
      method: "POST",
      url: "/login",
      body: {
        email: "test@test.com",
      },
    });

    const response2 = await app.inject({
      method: "POST",
      url: "/login",
      body: {
        password: "test1234",
      },
    });

    expect(response1.statusCode).toBe(400);
    expect(response2.statusCode).toBe(400);
  });

  test("returns 404 if the user doesn't exist", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/login",
      body: {
        email: "test@test.com",
        password: "test1234",
      },
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body).error).toBe("User not found");
  });

  test("returns 200 if the user does exist", async () => {
    const passwordHash = await bcrypt.hash("test1234", 10);

    await collection.insertOne({
      email: "test@test.com",
      password: passwordHash,
    });

    const response = await app.inject({
      method: "POST",
      url: "/login",
      body: {
        email: "test@test.com",
        password: "test1234",
      },
    });

    expect(response.statusCode).toBe(200);
  });
});

afterAll(async () => {
  closeConnection(client);
});
