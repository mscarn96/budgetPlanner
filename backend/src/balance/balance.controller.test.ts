import request from "supertest";

import AuthController from "../auth/auth.controller";
import BalanceController from "./balance.controller";

import App from "../app";
import LogInDto from "../auth/login.dto";

describe("Test Balance Controller", () => {
  const server = new App([new BalanceController(), new AuthController()]);
  let cookieToken: string;

  const PATH = "/balance";

  it("Logging in should return auth token", async () => {
    const userData: LogInDto = {
      email: "test@test.pl",
      password: "test123",
    };
    const result = await request(server.app)
      .post("/auth/login")
      .set("Cookie", [`Authorization=${cookieToken}`])
      .send(userData);

    cookieToken = result.header["raw-token"];

    expect(result.status).toBe(200);
  });

  it(`Creating new balance should return success status`, async () => {
    const result = await request(server.app)
      .post(PATH)
      .set("Cookie", [`Authorization=${cookieToken}`])
      .send();

    expect(result.status).toBe(200);
  });

  it(`Modyfying balance should return it`, async () => {
    const result = await request(server.app)
      .put(PATH)
      .set("Cookie", [`Authorization=${cookieToken}`])
      .send({ state: 100 });

    expect(result.status).toBe(200);
    expect(result.body.state).toBe(100);
  });

  it("Getting balance should return it", async () => {
    const result = await request(server.app)
      .get(PATH)
      .set("Cookie", [`Authorization=${cookieToken}`])
      .send();

    expect(result.status).toBe(200);
    expect(result.body.state).toBe(100);
  });

  it("Deleting balance should return success status", async () => {
    const result = await request(server.app)
      .delete(PATH)
      .set("Cookie", [`Authorization=${cookieToken}`])
      .send();

    expect(result.status).toBe(200);
  });
});
