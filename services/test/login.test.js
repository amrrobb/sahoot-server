const app = require('../app')
const request = require('supertest')
const { connect } = require('../config/mongodb')
const {hash} = require('../helpers/bcrypt')
const axios = require('axios')

let connection = null
let client = null
let db = null

jest.mock('axios')

const user_data = {
  "email": "israhadi@mail.com",
  "password": "hogake-ke-7"
}

beforeAll(async () => {
  if (process.env.NODE_ENV == "test") {
    connection = await connect()
    client = connection.client
    db = connection.database

    await db.collection("Users").insertOne({...user_data, password: hash(user_data.password)})

    return connection
  }
})
afterAll(async () => {
  if (process.env.NODE_ENV == "test") {
    await db.collection("Users").deleteMany({});

    await client.close();
  }
})


jest.setTimeout(5000)
describe('Login [SUCCESS CASE]', () => {
  it('login user success', (done) => {
    request(app)
      .post('/login')
      .send(user_data)
      .end((err, res) => {
        // console.log(res.body)
        expect(res.status).toBe(200)
        expect(res.body).toEqual(
          expect.objectContaining({
            access_token: expect.any(String)
          })
        )
        done()
      })
  })
})

describe('login [ERROR CASE]', () => {
  it('login user failed, wrong password', (done) => {
    request(app)
      .post('/login')
      .send({...user_data, password: null})
      .end((err, res) => {
        // console.log(res.body)
        expect(res.status).toBe(400)
        expect(res.body).toEqual(
          expect.objectContaining({
            code: 400,
            message: expect.any(Array)
          })
        )
        done()
      })
  }),
  it('login user failed, wrong email', (done) => {
    request(app)
      .post('/login')
      .send({...user_data, email: null})
      .end((err, res) => {
        // console.log(res.body)
        expect(res.status).toBe(400)
        expect(res.body).toEqual(
          expect.objectContaining({
            code: 400,
            message: expect.any(Array)
          })
        )
        done()
      })
  })
})

// describe('User Google Login [SUCCESS CASE]', () => {
  
//   test('Should send an access_token', (done) => {
//     const resp = {
//       data: {
//         access_token: 'thisIsAccessToken'
//       }
//     }
//     axios.mockResolvedValue(resp)
    
//     request(app)
//       .post('/googlelogin')
//       .send({
//         id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdmNTQ4ZjY3MDg2OTBjMjExMjBiMGFiNjY4Y2FhMDc5YWNiYzJiMmYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTI2MDAyMTcxNzczLXJjbnB0a3Q0NmNpZmtpYjNlazZwbzY1bzdsamg0amd2LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTI2MDAyMTcxNzczLXJjbnB0a3Q0NmNpZmtpYjNlazZwbzY1bzdsamg0amd2LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE0OTI2Nzk3Njc2OTE4NjMwNTM3IiwiZW1haWwiOiJmYWRpbGFoLmFyaWZraTI5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiZUFla19pdjljcE5IU3NLMmdFMzVXZyIsIm5hbWUiOiJGYWRpbGFoIEFyaWZraSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHaEpnY2k0Vm9OdEdPSHZxMDItVmpaUmlfSnVvTXNBTTVzTy0yYS1Gdz1zOTYtYyIsImdpdmVuX25hbWUiOiJGYWRpbGFoIiwiZmFtaWx5X25hbWUiOiJBcmlma2kiLCJsb2NhbGUiOiJpZCIsImlhdCI6MTYyNzA1NDMyMywiZXhwIjoxNjI3MDU3OTIzLCJqdGkiOiIzNjlhY2ZjNmFlNTQ5OTRiYTA0NDk4ZGEwYmFiNDg0NTZmODQwODIzIn0.dpeP3zPVfEWDGNmt6_TwjXKpgiHhfFno3wS0UK4Z3xoZAPDPmZXx9hEhE9Fda2gXB6pTd2HfEyR3WyOCNrIRqjSG4XAtBKAowZwkqv5ouiyh0eBmAajos-HCZgdMNjkk-pv524vsZL1Ai9o3eExCJBUm5LZqe5ggPouP_hJU8FmntFcHGCLE6kR1GWdcuY1xVz5VkdEy3LaO-kLK1WiqqcVaZ9QE9C1WStGS1q5fZOI9v7YPh-ByrIo2hynkHKzJWTAHlFxYi6c5mt6zs1XnWrzWErMIvJgZstt4ij6mocOBErutsfRwkdSYs4zk7QCHobT2UPStxXkk8wZnNSaAbA'
//       })
//       .end((err, res) => {
//         if (err) {
//           done(err)
//         } else {
//           console.log(res.body);
//           expect(res.status).toBe(200)
//           // expect(res.body).toHaveProperty('access_token', expect.any(String))
//           done()
//         }
//       })
//   })

// })

describe('User Google Login [ERROR CASE]', () => {
  
  test('Cannot login with google', (done) => {
   
    request(app)
      .post('/googlelogin')
      .send({
        id_token: 'notIdToken'
      })
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          expect(res.status).toBe(500)
          expect(res.body).toEqual(
            expect.objectContaining({
              code: 500,
              message: expect.any(Array)
            })
          )
          done()
        }
      })
  })

})