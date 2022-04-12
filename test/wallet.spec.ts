import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

let userConsumer = {
    email: 'userfortestconsumer@email.com',
    password: 'supersecret123'
}

let userCompany = {
    email: 'userfortestcompany@email.com',
    password: 'supersecret123'
}

let useruniversity = {
    email: 'userfortestuniversity@email.com',
    password: 'supersecret123'
}

test.group('get wallet', () => {
  test('get wallet consumer', async () => {
    await supertest(BASE_URL)
      .get('/api/v1/wallets')
      .auth(userConsumer.email, userConsumer.password, { type: 'basic' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    })

    test('get wallet company', async () => {
        await supertest(BASE_URL)
          .get('/api/v1/wallets')
          .auth(userCompany.email, userCompany.password, { type: 'basic' })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
    })
    
    test('get wallet university', async () => {
        await supertest(BASE_URL)
            .get('/api/v1/wallets')
            .auth(useruniversity.email, useruniversity.password, { type: 'basic' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    })
})

test.group('add money wallet', () => {
  test('Should add money in personal wallet with user type consumer', async () => {
    await supertest(BASE_URL)
      .put('/api/v1/wallets/add-money')
      .auth(userConsumer.email, userConsumer.password, { type: 'basic' })
      .send({
        value: Math.random() * 100
      })
      .set('Accept', 'application/json')
      .expect(204)
  })

  test('Should add money in personal wallet with user type company', async () => {
    await supertest(BASE_URL)
      .put('/api/v1/wallets/add-money')
      .auth(userCompany.email, userCompany.password, { type: 'basic' })
      .send({
        value: Math.random() * 100
      })
      .set('Accept', 'application/json')
      .expect(403)
  })

  test('Should add money in personal wallet with user type university', async () => {
    await supertest(BASE_URL)
      .put('/api/v1/wallets/add-money')
      .auth(userCompany.email, userCompany.password, { type: 'basic' })
      .send({
        value: Math.random() * 100
      })
      .set('Accept', 'application/json')
      .expect(403)
  })

  test('Should add money in personal wallet with user with wrong password', async () => {
    await supertest(BASE_URL)
      .put('/api/v1/wallets/add-money')
      .auth(userConsumer.email, '12345678', { type: 'basic' })
      .send({
        value: Math.random() * 100
      })
      .set('Accept', 'application/json')
      .expect(401)
  })
})

test.group('remove money wallet', () => {
  test('Should remove money in personal wallet with user type company with balance', async () => {
    const user = await User.query().where('email', userCompany.email).firstOrFail()

    await user.related('wallet').query().update({ balance: 100 }).firstOrFail()

    await supertest(BASE_URL)
      .put('/api/v1/wallets/remove-money')
      .auth(userCompany.email, userCompany.password, { type: 'basic' })
      .send({
        value:  100
      })
      .set('Accept', 'application/json')
      .expect(204)
  })

  test('Should remove money in personal wallet with user type university with balance', async () => {
    const user = await User.query().where('email', useruniversity.email).firstOrFail()

    await user.related('wallet').query().update({ balance: 100 }).firstOrFail()

    await supertest(BASE_URL)
      .put('/api/v1/wallets/remove-money')
      .auth(useruniversity.email, useruniversity.password, { type: 'basic' })
      .send({
        value:  100
      })
      .set('Accept', 'application/json')
      .expect(204)
  })

  test('Should remove money in personal wallet with user type company without balance', async () => {
    const user = await User.query().where('email', userCompany.email).firstOrFail()

    await user.related('wallet').query().update({ balance: 0 }).firstOrFail()

    await supertest(BASE_URL)
      .put('/api/v1/wallets/remove-money')
      .auth(userCompany.email, userCompany.password, { type: 'basic' })
      .send({
        value:  100
      })
      .set('Accept', 'application/json')
      .expect(403)
  })

  test('Should remove money in personal wallet with user type consumer', async () => {
    const user = await User.query().where('email', userCompany.email).firstOrFail()

    await user.related('wallet').query().update({ balance: 100 }).firstOrFail()

    await supertest(BASE_URL)
      .put('/api/v1/wallets/remove-money')
      .auth(userConsumer.email, userConsumer.password, { type: 'basic' })
      .send({
        value:  100
      })
      .set('Accept', 'application/json')
      .expect(403)
  })

  test.only('Should remove money in personal wallet with user type company does not sending value', async () => {
    const user = await User.query().where('email', userCompany.email).firstOrFail()

    await user.related('wallet').query().update({ balance: 100 }).firstOrFail()

    await supertest(BASE_URL)
      .put('/api/v1/wallets/remove-money')
      .auth(userCompany.email, userCompany.password, { type: 'basic' })
      .expect(422)
  })
})
