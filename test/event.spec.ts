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

const eventData = {
  title: 'Event test',
  description: 'test event',
  ticket_price: Math.round(Math.random() * 100),
  qtd_avalible_tickets: Math.round(Math.random() * 100),
  event_dates: ['2020-01-01 00:00', '2020-01-02 00:00'],
  day_titles: ['Day 1', 'Day 2']
}

test.group('Create Event', () => {
  test('Should create a event with user type company', async () => {
    await supertest(BASE_URL)
      .post('/api/v1/events')
      .auth(userCompany.email, userCompany.password, { type: 'basic' })
      .set('Accept', 'application/json')
      .send(eventData)
      .expect('Content-Type', /json/)
      .expect(201)
  })

  test('Should create a event with user type university', async () => {
    await supertest(BASE_URL)
      .post('/api/v1/events')
      .auth(useruniversity.email, useruniversity.password, { type: 'basic' })
      .set('Accept', 'application/json')
      .send(eventData)
      .expect('Content-Type', /json/)
      .expect(201)
  })

  test('Should create a event with user type consumer', async () => {
    await supertest(BASE_URL)
      .post('/api/v1/events')
      .auth(userConsumer.email, userConsumer.password, { type: 'basic' })
      .set('Accept', 'application/json')
      .send(eventData)
      .expect('Content-Type', /json/)
      .expect(403)
  })
})

