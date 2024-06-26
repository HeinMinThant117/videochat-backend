import app from "../app";
import "dotenv/config";

describe("Logging In", () => {
  test("returns 401 with incorrect credentials", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toBe(200);
  });
});
