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
  test("returns 400 with missing request body data", async () => {
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
    expect(response.json().error).toBe("User not found");
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

describe("Registering", () => {
  const sendRegisterRequest = async (body) => {
    return await app.inject({
      url: "/register",
      method: "POST",
      body,
    });
  };

  test("returns 400 if missing request body data", async () => {
    const response1 = await sendRegisterRequest({
      email: "hein@test.com",
      password: "hein1234",
    });
    const response2 = await sendRegisterRequest({
      name: "hein",
      password: "hein1234",
    });
    const response3 = await sendRegisterRequest({
      name: "hein",
      email: "hein@test.com",
    });

    expect(response1.statusCode).toBe(400);
    expect(response2.statusCode).toBe(400);
    expect(response3.statusCode).toBe(400);
  });

  test("returns 409 if the user already exists", async () => {
    await collection.insertOne({
      username: "hein",
      email: "hein@test.com",
      password: "hein1234",
    });

    const response = await sendRegisterRequest({
      username: "hein",
      email: "hein@test.com",
      password: "hein1234",
    });

    expect(response.statusCode).toBe(409);
  });

  test("returns 200 if it's successful", async () => {
    const response = await sendRegisterRequest({
      username: "hein",
      email: "hein@test.com",
      password: "hein1234",
    });

    expect(response.statusCode).toBe(200);

    const users = await collection.find({}).toArray();
    expect(users.length).toBe(1);
    expect(users[0].email).toBe("hein@test.com");
  });
});

describe("Getting a user", () => {
  test("returns 401 if invalid token", async () => {
    const response = await app.inject({
      url: "/user",
    });

    expect(response.statusCode).toBe(401);
  });

  test("returns 200 if it's a valid token", async () => {
    const passwordHash = await bcrypt.hash("test1234", 10);
    await collection.insertOne({
      username: "hein",
      email: "hein@test.com",
      password: passwordHash,
    });

    const response = await app.inject({
      url: "/login",
      method: "POST",
      body: {
        email: "hein@test.com",
        password: "test1234",
      },
    });

    expect(response.statusCode).toBe(200);
    const token = response.json().user.token;

    const userResponse = await app.inject({
      url: "/user",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(userResponse.statusCode).toBe(200);
    expect(userResponse.json().user.email).toBe("hein@test.com");
  });
});

afterAll(async () => {
  closeConnection(client);
});
