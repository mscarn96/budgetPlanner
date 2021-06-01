import request from "supertest";

import AuthController from "../auth/auth.controller";
import IncomeController from "./income.controller";

import App from "../app";
import CreateIncomeDto from "./income.dto";
import LogInDto from "../auth/login.dto";

const PATH = "/incomes";

describe("Test income controller", () => {
  const server = new App([new IncomeController(), new AuthController()]);
  let incomeId: string;
  let cookieToken: string;

  it("Logging in should return auth token", async () => {
    const userData: LogInDto = {
      email: "test@test.pl",
      password: "test123",
    };
    const result = await request(server.app).post("/auth/login").send(userData);

    cookieToken = result.header["raw-token"];

    expect(result.status).toBe(200);
  });

  it("Sending get request on path '/' should return all user incomes", async () => {
    const result = await request(server.app)
      .get(PATH)
      .set("Cookie", [`Authorization=${cookieToken}`])
      .send();

    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual([]);
  });

  it("Creating new income should return it", async () => {
    const createdAt = new Date();
    const income: CreateIncomeDto = {
      createdAt,
      name: "testIncome",
      cyclic: false,
      value: 500,
    };
    const result = await request(server.app)
      .post(PATH)
      .set("Cookie", [`Authorization=${cookieToken}`])
      .send(income);

    expect(result.status).toBe(200);
    expect(result.body.name).toBe("testIncome");

    incomeId = result.body._id;
  });

  it("Modyfing income should return it", async () => {
    const editedIncome = {
      name: "next test",
    };

    const result = await request(server.app)
      .put(`${PATH}/${incomeId}`)
      .set("Cookie", [`Authorization=${cookieToken}`])
      .send(editedIncome);
    expect(result.status).toBe(200);
    expect(result.body.name).toBe("next test");
  });

  it("Removing income should return success status", async () => {
    const result = await request(server.app)
      .delete(`${PATH}/${incomeId}`)
      .set("Cookie", [`Authorization=${cookieToken}`])
      .send();

    expect(result.status).toBe(200);
  });
});
