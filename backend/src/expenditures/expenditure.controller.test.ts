import request from "supertest";

import AuthController from "../auth/auth.controller";
import ExpenditureController from "../expenditures/expenditure.controller";

import App from "../app";
import CreateExpenditureDto from "./expenditure.dto";

describe("Test Expenditure Contoller", () => {
  const server = new App([new ExpenditureController(), new AuthController()]);
  let expenditureId: string;
  let cookieToken: string;

  it(`Get request on path "/" should return all expenditures`, async () => {
    const result = await request(server.app).get("/expenditures").send();
    expect(result.status).toBe(200);
    expect(result.body).toStrictEqual([]);
  });

  it("Logging in to should return auth token", async () => {
    const result = await request;
  });

  it("Creating new expenditure should returns it", async () => {
    const createdAt = new Date();
    const expenditure: CreateExpenditureDto = {
      name: "test",
      cyclic: false,
      value: 500,
      createdAt,
    };

    const result = await request(server.app)
      .post("/expenditures")
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
      .send(editedExpenditure);

    console.log(result.body);

    expect(result.status).toBe(200);
    expect(result.body.name).toBe("next test");
  });
});
