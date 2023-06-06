const request = require("supertest");
const app = require("./../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const { loadPlanetsData } = require("../../models/planets.model");
describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });
  describe("Test Get /launches", () => {
    test("should respond with 200 succeess", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
  describe("Test POST /launches", () => {
    const completeLaunchData = {
      mission: "USS Enterpries",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "January 4, 2028",
    };
    const lauchDataWithoutData = {
      mission: "USS Enterpries",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
    };
    const lauchDataWithInvalidDate = {
      mission: "USS Enterpries",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "Janduasr",
    };
    test("should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(lauchDataWithoutData);
    });
    test("should catch missing require properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(lauchDataWithoutData)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "missing required launch",
      });
    });
    test("should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(lauchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
