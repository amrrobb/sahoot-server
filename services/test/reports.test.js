const { connect } = require("../config/mongodb");
const app = require("../app");
const request = require("supertest");
const { dummyReports, isValidDate } = require("./testing.helpers");
const {generateJWT, verifyJWT}= require('../helpers/jwt')

let db = null;
let client = null;
let connection = null;

const reportData = {
  quizId: "1021efg",
  quizTitle: "Quiz baru",
  players: [{ name: "ba", score: 80 }],
};

const user_data = {
  "email": "email@mail.com",
  "password": "password"
}

let access_token = null
let id = null

beforeAll(async () => {
  if (process.env.NODE_ENV == "test") {
    connection = await connect();
    client = connection.client;
    db = connection.database;

    const users = await db.collection("Users");
    let {insertedId} = await users.insertOne(user_data)

    access_token =  generateJWT({
        email: user_data.email,
        name: "email",
        id: insertedId
    })

    let inputReports = dummyReports()
    inputReports.forEach(el => el.userId = insertedId.toHexString())

    const reports = await db.collection("Reports");
    const {insertedIds} = await reports.insertMany(inputReports);

    id = insertedIds[0].toHexString()

    // let dbReport =  await db.collection("Reports").find().toArray()
    // console.log(dbReport);

    return connection;
  }
});

afterAll(async () => {
  if (process.env.NODE_ENV == "test") {
    await db.collection("Reports").deleteMany({});
    await db.collection("Users").deleteMany({});

    await client.close();
  }
});

jest.setTimeout(5000);

describe("Reports [SUCCESS CASE]", () => {
  it("Get all reports", (done) => {
    request(app)
      .get("/reports")
      .set({access_token})
      .end((err, res) => {
        if (err) done(err);
        else {
          const reportsArray = res.body;
          expect(res.status).toBe(200);

          reportsArray.forEach((report) => {
            expect(isValidDate(report.createdAt)).toBe(true);
            expect(report).toHaveProperty("_id", expect.any(String));
            expect(report).toHaveProperty("userId", expect.any(String));
            expect(report).toHaveProperty("quizId", expect.any(String));
            expect(report).toHaveProperty("playersCount", expect.any(Number));
            expect(report).toHaveProperty("players", expect.any(Array));
            report.players.forEach((player) => {
              expect(player).toHaveProperty("name", expect.any(String));
              expect(player).toHaveProperty("score", expect.any(Number));
            });
          });

          done();
        }
      });
  });
  it("Get report by Id", (done) => {
    request(app)
      .get(`/reports/${id}`)
      .set({access_token})
      .end((err, res) => {
        if (err) done(err);
        else {
          const report = res.body;
          // console.log(report);
          expect(res.status).toBe(200);
          // expect(report._id).toBe(id);
          expect(isValidDate(report.createdAt)).toBe(true);
          expect(report).toHaveProperty("userId", expect.any(String));
          expect(report).toHaveProperty("quizId", expect.any(String));
          expect(report).toHaveProperty("playersCount", expect.any(Number));
          expect(report).toHaveProperty("players", expect.any(Array));
          report.players.forEach((player) => {
            expect(player).toHaveProperty("name", expect.any(String));
            expect(player).toHaveProperty("score", expect.any(Number));
          });

          done();
        }
      });
  }),
    it("Create new report", (done) => {
      request(app)
        .post("/reports")
        .send(reportData)
        .set({access_token})
        .end((err, res) => {
          if (err) done(err);
          else {
            const report = res.body;
            expect(res.status).toBe(201);

            // console.log(report);
            expect(isValidDate(report.createdAt)).toBe(true);
            expect(report).toHaveProperty("_id", expect.any(String));
            expect(report).toHaveProperty("userId", expect.any(String));
            expect(report).toHaveProperty("quizId", expect.any(String));
            expect(report).toHaveProperty("playersCount", expect.any(Number));
            expect(report).toHaveProperty("players", expect.any(Array));
            report.players.forEach((player) => {
              expect(player).toHaveProperty("name", expect.any(String));
              expect(player).toHaveProperty("score", expect.any(Number));
            });

            done();
          }
        });
    }),
    it("Delete report by Id", (done) => {
      request(app)
        .delete(`/reports/${id}`)
        .set({access_token})
        .end((err, res) => {
          if (err) done(err);
          else {
            const response = res.body;
            expect(res.status).toBe(200);
            expect(response).toHaveProperty("message", "Delete Item Success");

            done();
          }
        });
    });
});

describe("Reports [ERROR CASE]", () => {
  it("User must login first", (done) => {
    request(app)
      .get("/reports")
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(401);
          expect(res.body).toEqual(
            expect.objectContaining({
              code: 401,
              message: expect.arrayContaining([expect.any(String)]),
            })
          );

          done();
        }
      });
  }),
    it("Report not found, wrong Id", (done) => {
      request(app)
        .get("/reports/AbsolutlyWrong")
        .set({access_token})
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).toBe(404);
            expect(res.body).toEqual(
              expect.objectContaining({
                code: 404,
                message: expect.arrayContaining([expect.any(String)]),
              })
            );

            done();
          }
        });
    }),
    it("quizId is null", (done) => {
      request(app)
        .post("/reports")
        .set({access_token})
        .send({
          ...reportData,
          quizId: null,
        })
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).toBe(400);
            expect(res.body).toEqual(
              expect.objectContaining({
                message: expect.arrayContaining([expect.any(String)]),
              })
            );
            done();
          }
        });
    });
  it("Empty input", (done) => {
    request(app)
      .post("/reports")
      .set({access_token})
      .send({})
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(400);
          expect(res.body).toEqual(
            expect.objectContaining({
              message: expect.arrayContaining([expect.any(String)]),
            })
          );
          done();
        }
      });
  });
  it("Invalid Access Token", (done) => {
    request(app)
      .get(`/reports`)
      .set({ access_token: "AbsolutlyNotAccesToken" })
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(401);

          expect(res.body).toEqual(
            expect.objectContaining({
              code: 401,
              message: expect.arrayContaining([expect.any(String)]),
            })
          );
          done();
        }
      });
  }),
  it("Cannot delete report, wrong Id", (done) => {
    request(app)
      .delete("/reports/AbsolutlyWrong")
      .set({access_token})
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(404);
          expect(res.body).toEqual(
            expect.objectContaining({
              code: 404,
              message: expect.arrayContaining([expect.any(String)]),
            })
          );
          client.close().then((_) => {
            done();
          });
        }
      });
  }),

    it("Internal Server Error (get all reports)", (done) => {
      request(app)
        .get(`/reports`)
        .set({access_token})
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).toBe(500);

            expect(res.body).toEqual(
              expect.objectContaining({
                code: 500,
                message: expect.arrayContaining([expect.any(String)]),
              })
            );
            // client.connect().then((_) => {
            // });
            done();
          }
        });
    }),
    it("Internal Server Error (get report by Id)", (done) => {
      request(app)
        .get("/reports/60fad998cbd8d3ed1ba95f71")
        .set({access_token})
        .end((err, res) => {
          if (err) done(err);
          else {
            expect(res.status).toBe(500);

            expect(res.body).toEqual(
              expect.objectContaining({
                code: 500,
                message: expect.arrayContaining([expect.any(String)]),
              })
            );
            client.connect().then((_) => {
              done();
            });
          }
        });
    });
});
