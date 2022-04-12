import test from 'japa'
import supertest from 'supertest'
import { userType } from 'Contracts/enums'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', () => {
  test('Should create a user with type consumer', async () => {
    await supertest(BASE_URL)
      .post('/api/v1/user')
      .send({
        name: 'user consumer',
        email: 'userconsumer@email.com',
        password: '12345678',
        avatar: 'https://avatars0.githubusercontent.com/u/1234?v=4', 
        type: userType.CONSUMER 
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
    })

    test('Should create a user with type company', async () => {
      await supertest(BASE_URL)
        .post('/api/v1/user')
        .send({
          name: 'user company',
          email: 'usercompany@email.com',
          password: '12345678',
          avatar: 'https://avatars0.githubusercontent.com/u/1234?v=4', 
          type: userType.COMPANY 
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
    })
    
    test('Should create a user with type university', async () => {
      await supertest(BASE_URL)
        .post('/api/v1/user')
        .send({
          name: 'user university',
          email: 'useruniversity@email.com',
          password: '12345678',
          avatar: 'https://avatars0.githubusercontent.com/u/1234?v=4',
          type: userType.UNIVERSITY
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
    })
})
