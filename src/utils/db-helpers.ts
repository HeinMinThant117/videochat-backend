import { MongoClient } from "mongodb";

export const initDB = async () => {
  const client = new MongoClient(process.env.MONGODB_TEST_URI, {
    auth: {
      username: process.env.MONGODB_TEST_USERNAME,
      password: process.env.MONGODB_TEST_PASSWORD,
    },
  });
  await client.connect();
  return client;
};

export const getCollection = async (name: string, client: MongoClient) => {
  const db = client.db("vidchatDBTest");
  const collection = db.collection("users");
  return collection;
};

export const closeConnection = async (client: MongoClient) => {
  if (client && client instanceof MongoClient) {
    await client.close();
  }
};
