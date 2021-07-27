const app = require("../app");
const request = require("supertest");
const {generateJWT}= require('../helpers/jwt')
const { connect } = require("../config/mongodb");


let dataQuiz = {
  title: "quiz1",
  questions: [
    {
      type: "text",
      question: "penemu bola lampu ?",
      image: "null",
      choose: ["aku", "kamu", "dia", "mereka"],
      answer: "aku",
    },
  ],
  timer: 20,
  mode: "live",
  createdAt: new Date(),
  updatedAt: new Date()
};

const user_data = {
  "email": "email@mail.com",
  "password": "password"
}

let connection = null
let client = null
let db = null
let id = null
let access_token = null

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

    const quiz = await db.collection("Quizzes").insertOne({...dataQuiz, userId: insertedId.toHexString()});
    id = quiz.insertedId.toHexString()

    // console.log(quiz);
    return connection;
  }
});

afterAll(async () => {
  if (process.env.NODE_ENV == "test") {
    await db.collection("Quizzes").deleteMany({});
    await db.collection("Users").deleteMany({});

    await client.close();
  }
});

jest.setTimeout(5000);
describe("Test Quizzes [SUCCESS CASE]", () => {
  it("test get all Quizzes", (done) => {
    request(app)
      .get("/quizzes")
      .set({access_token})
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(200);

          expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                _id: expect.any(String),
                userId: expect.any(String),
                title: expect.any(String),
                timer: expect.any(Number),
                mode: expect.any(String),
                questions: expect.arrayContaining([
                  expect.objectContaining({
                    type: expect.any(String),
                    question: expect.any(String),
                    image: expect.any(String),
                    answer: expect.any(String),
                    choose: expect.arrayContaining([expect.any(String)]),
                  }),
                ]),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              }),
            ])
          );
          done();
        }
      });
  });

  it("Test get by id Quiz ", (done) => {
    request(app)
      .get(`/quizzes/${id}`)
      .set({access_token})
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(200);
          expect(res.body).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              userId: expect.any(String),
              title: expect.any(String),
              timer: expect.any(Number),
              mode: expect.any(String),
              questions: expect.arrayContaining([
                expect.objectContaining({
                  type: expect.any(String),
                  question: expect.any(String),
                  image: expect.any(String),
                  answer: expect.any(String),
                  choose: expect.arrayContaining([expect.any(String)]),
                }),
              ]),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          );

          done();
        }
      });
  });

  it("Test create Quiz", (done) => {
    request(app)
      .post(`/quizzes`)
      .send({
        title: "quiz ku",
        questions: [
          {
            type: "live",
            question: "siap presiden pertama indonesia ?",
            image: "null",
            choose: ["Soekarno", "Soeharto", "SBY", "Jokowi"],
            answer: "Soekarno",
          },
        ],
        timer: 20,
        mode: "challenge",
      })
      .set({access_token})
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(201);
          expect(res.body).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              userId: expect.any(String),
              title: expect.any(String),
              timer: expect.any(Number),
              mode: expect.any(String),
              questions: expect.arrayContaining([
                expect.objectContaining({
                  type: expect.any(String),
                  question: expect.any(String),
                  image: expect.any(String),
                  answer: expect.any(String),
                  choose: expect.arrayContaining([expect.any(String)]),
                }),
              ]),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          );

          done();
        }
      });
  });

  it("Test update Quiz", (done) => {
    request(app)
      .put(`/quizzes/${id}`)
      .send({
        title: "quiz ku update",
        questions: [
          {
            type: "live",
            question: "siap presiden pertama indonesia ?",
            image: "null",
            choose: ["Soekarno", "Soeharto", "SBY", "Jokowi"],
            answer: "Soekarno",
          },
        ],
        timer: 20,
        mode: "challenge",
      })
      .set({access_token})
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(200);
          expect(res.body).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              userId: expect.any(String),
              title: expect.any(String),
              timer: expect.any(Number),
              mode: expect.any(String),
              questions: expect.arrayContaining([
                expect.objectContaining({
                  type: expect.any(String),
                  question: expect.any(String),
                  image: expect.any(String),
                  answer: expect.any(String),
                  choose: expect.arrayContaining([expect.any(String)]),
                }),
              ]),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          );

          done();
        }
      });
  });

  it("Test delete Quiz by id  ", (done) => {
    request(app)
      .delete(`/quizzes/${id}`)
      .set({access_token})
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(200);

          expect(res.body).toEqual(
            expect.objectContaining({
              message: expect.any(String),
            })
          );

          done();
        }
      });
  });
});

describe("Test Quizzes [ERROR CASE]", () => {
  it("test get quiz by id, id should be 24 hex characters", (done) => {
    request(app)
      .get(`/quizzes/123123`)
      .set({access_token})
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(400);
          expect(res.body).toEqual(
            expect.objectContaining({
              code: 400,
              message: expect.arrayContaining([expect.any(String)]),
            })
          );

          done();
        }
      });
  });

  it("test get quiz by id, id not found", (done) => {
    request(app)
      .get(`/quizzes/123123123123123123123123`)
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
  });

  it("test post quiz, empty input", (done) => {
    request(app)
      .post(`/quizzes`)
      .send({})
      .set({access_token})
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(400);
          expect(res.body).toEqual(
            expect.objectContaining({
              code: 400,
              message: expect.arrayContaining([expect.any(String)]),
            })
          );

          done();
        }
      });
  });

  it("test update quiz, id should be 24 hex characters", (done) => {
    request(app)
      .put(`/quizzes/123`)
      .send({
        questions: [
          {
            type: "text",
            question: "siap presiden pertama indonesia ?",
            image: "null",
            choose: ["Soekarno", "Soeharto", "SBY", "Jokowi"],
            answer: "Soekarno",
          },
        ],
        timer: 20,
        mode: "challenge",
      })
      .set({access_token})
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(400);

          expect(res.body).toEqual(
            expect.objectContaining({
              code: 400,
              message: expect.arrayContaining([expect.any(String)]),
            })
          );

          done();
        }
      });
  });


  it("test update quiz, quiz not found", (done) => {
    request(app)
      .put(`/quizzes/123123123123123123123123`)
      .send({
        title: "quiz update",
        questions: [
          {
            type: "text",
            question: "siap presiden pertama indonesia ?",
            image: "null",
            choose: ["Soekarno", "Soeharto", "SBY", "Jokowi"],
            answer: "Soekarno",
          },
        ],
        timer: 20,
        mode: "challenge",
      })
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
  });

  it("test update quiz, empty input", (done) => {
    request(app)
      .put(`/quizzes/${id}`)
      .send({
        userId: "",
        questions: [
          {
            type: "text",
            question: "siap presiden pertama indonesia ?",
            image: "null",
            choose: ["Soekarno", "Soeharto", "SBY", "Jokowi"],
            answer: "Soekarno",
          },
        ],
        timer: "",
        mode: "",
      })
      .set({access_token})
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(400);

          expect(res.body).toEqual(
            expect.objectContaining({
              code: 400,
              message: expect.arrayContaining([expect.any(String)]),
            })
          );

          done();
        }
      });
  });

  it("test delete quiz, id should be 24 hex characters", (done) => {
    request(app)
      .delete(`/quizzes/123`)
      .set({access_token})
      .end((err, res) => {
        if (err) done(err);
        else {
          expect(res.status).toBe(400);

          expect(res.body).toEqual(
            expect.objectContaining({
              code: 400,
              message: expect.arrayContaining([expect.any(String)]),
            })
          );

          done();
        }
      });
  });

  it("test delete quiz, quiz not found", (done) => {
    request(app)
      .delete(`/quizzes/123123123123123123123123`)
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

  it("Please login first", (done) => {
    request(app)
      .get(`/quizzes`)
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
  });

  it("Invalid Access Token", (done) => {
    request(app)
      .get(`/quizzes`)
      .set({access_token: 'AbsolutlyNotAccesToken'})
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
          
          client.close()
          .then(_ => {
            done();
          })
        }
      });
  });

  it("Internal Server Error", (done) => {
    request(app)
      .get(`/quizzes`)
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
          client.connect()
          .then(_ => {
            done();
          })
        }
      });
  });

});
