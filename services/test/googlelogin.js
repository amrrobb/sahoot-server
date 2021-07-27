const app = require('../app')
const request = require('supertest')
const { connect } = require('../config/mongodb')
const axios = require('axios')

let connection = null
let client = null
let db = null

jest.mock('axios')

let user_data = {
  "email": "email@mail.com",
  "password": "password"
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

// describe('Oauth by google login', () => {
//   it('google login', (done) => {
//     const resp = {
//       data: {
//         access_token: 'thisIsAccessToken'
//       }
//     }
//     axios.mockResolvedValue(resp)
//     const idToken = "thisISgoogleToken"

//     request(app)
//       .post('/googlelogin')
//       .send({idToken})
//       .end((err, res) => {
//         expect(res.status).toBe(200)
//         console.log(res.body);
//         // expect(res.body).toEqual(
//         //   expect.objectContaining({
//         //     access_token: expect.any(String)
//         //   })
//         // )
//         done()
//       })
//   })
// })

describe('User Google Login [SUCCESS CASE]', () => {
  
  test('Should send an object with key: access_token, id, email', (done) => {
    const resp = {
      data: {
        access_token: 'asdasdasdasd',
        id: '1',
        email: 'user@mail.com'
      }
    }
    axios.mockResolvedValue(resp)
    
    request(app)
      .post('/googleLogin')
      .send({
        token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNkZjBhODMxZTA5M2ZhZTFlMjRkNzdkNDc4MzQ0MDVmOTVkMTdiNTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTAzNTUyMTA3NDYxOC1ua290cGNlYjNwNjBtdXUwaDVybWY2aG41cGU3MmR0Yy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwMzU1MjEwNzQ2MTgtbmtvdHBjZWIzcDYwbXV1MGg1cm1mNmhuNXBlNzJkdGMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQ0ODQwMDg0MzgxMDAyMzkzMDEiLCJlbWFpbCI6ImZhZGhpbG1obW1kQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiY194MWR4RHY0QW1Qc2lMSHlTUGRIQSIsIm5hbWUiOiJGYWRoaWwgTXVoYW1tYWQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2pUbk0yMTM4dlZxTzZmc2dYQlBWcG5kTkZmUVhsM0EyamVwdUphY1E9czk2LWMiLCJnaXZlbl9uYW1lIjoiRmFkaGlsIiwiZmFtaWx5X25hbWUiOiJNdWhhbW1hZCIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjI3MzczODE1LCJleHAiOjE2MjczNzc0MTUsImp0aSI6ImNjY2M1OTIxOGMxZTlmMTUxMTE2M2M1NTlhZTI4ZWZhMmFhZDk3MWUifQ.MztE3jDzY7Mz-13PTSOOperXU2LBlF34_QxSp1REgW8LJiBr3SPP4Pg_QjICoEJLkzC3T7a-aFgkY5rxDuLPT8LDDG8Emcrm7WhuPcci737SQIEwYTHk1rQaWPicBlLneBM-4Ic7qeuXOYh5JNxEZmg3QpkPwyg4oTwtxzFYcWpxXE4m02ESR_Uo8SLxmFidMunUoAyIl6EdsLTXY74Gy5hnBJH9CA2Qfvk09a5dUdsmEApevB00MnkrnufeFu8CE1aJkByinyuRgNT1mqy6d8UG6rsYTWRdumC1rPqXIKwTPpEsQyORMDBdmLsx3au2QlX4JAiUXs9AnV8jcEytRA'
      })
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          console.log(res.body);
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty('access_token', expect.any(String))
          expect(res.body).toHaveProperty('id', expect.any(Number))
          expect(res.body).toHaveProperty('email', expect.any(String))
          done()
        }
      })
  })

})