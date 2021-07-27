const app = require('../app')
const request = require('supertest')
const { connect } = require('../config/mongodb')

let connection
let client
let db

beforeAll(async () => {
  connection = await connect()
  client = connection.client
  db = connection.db
  return connection
})
afterAll(async () => {
  await client.close()
})
const user = {
  "email": "israhadi@mail.com",
  "password": "hogake-ke-7"
}
jest.setTimeout(10000)
describe('Register [SUCCESS CASE]', () => {
  it('Register success', (done) => {
    request(app)
      .post('/register')
      .send(user)
      .end((err, res) => {
        expect(res.status).toBe(201)
        expect(res.body).toEqual(
          expect.objectContaining({
            acknowledged: expect.any(Boolean),
            insertedId: expect.any(String)
          })
        )
        done()
      })
  })
})

describe('Register [ERROR CASE]', () => {
  it('Register fail, wrong input', (done) => {
    request(app)
      .post('/register')
      .send({})
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body).toEqual(
          expect.objectContaining({
            code: 400,
            message: expect.arrayContaining([expect.any(String)]),
          })
        );
        done()
      })
  })
})