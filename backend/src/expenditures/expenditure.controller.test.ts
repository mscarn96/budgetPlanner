import request from "supertest";

import AuthController from "../auth/auth.controller";
import ExpenditureController from "./expenditure.controller";

import App from "../app";
import CreateExpenditureDto from "./expenditure.dto";
import LogInDto from "../auth/login.dto";

describe("Test Expenditure Contoller", () => {
  const server = new App([new ExpenditureController(), new AuthController()]);
  let expenditureId: string;
  let cookieToken: string;

  it(`Get request on path "/" should return all expenditures`, async () => {
    const result = await request(server.app).get("/expenditures").send();
    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual([]);
  });

  it("Logging in should return auth token", async () => {
    const userData: LogInDto = {
      email: "test@test.pl",
      password: "test123",
    };
    const result = await request(server.app).post("/auth/login").send(userData);

    cookieToken = result.header["raw-token"];

    expect(result.status).toBe(200);
  });

  it("Creating new expenditure should return it", async () => {
    const createdAt = new Date();
    const expenditure: CreateExpenditureDto = {
      name: "test",
      cyclic: true,
      value: 500,
      dayPeriod: 30,
      createdAt,
    };

    const result = await request(server.app)
      .post("/expenditures")
      .set("Cookie", [`Authorization=${cookieToken}`])
      .send(expenditure);
    expect(result.status).toBe(200);
    expect(result.body.name).toBe("test");

    expenditureId = result.body._id;
  });

  it("Modyfing expenditure should return it ", async () => {
    const editedExpenditure = {
      name: "next test",
    };

    const result = await request(server.app)
      .put(`/expenditures/${expenditureId}`)
      .set("Cookie", [`Authorization=${cookieToken}`])
      .send(editedExpenditure);

    expect(result.status).toBe(200);
    expect(result.body.name).toBe("next test");
  });

  it("Removing expenditure should return success status ", async () => {
    const result = await request(server.app)
      .delete(`/expenditures/${expenditureId}`)
      .set("Cookie", [`Authorization=${cookieToken}`])
      .send();

    expect(result.status).toBe(200);
  });
});
