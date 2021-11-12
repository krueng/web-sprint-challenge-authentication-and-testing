const server = require('./server')
const request = require('supertest')
const db = require('../data/dbConfig')

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})

describe('[POST] /api/auth/register', () => {
  test('responds if missing username or password', async () => {
    const res = await request(server).post('/api/auth/register')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('username and password required')
  })
  test('responds if username is taken', async () => {
    const res = await request(server).post('/api/auth/register').send({username:'user', password:'pass'})
    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/username taken/i)
  })
  test('responds when registration is valid', async () => {
    const res = await request(server).post('/api/auth/register').send({username:'foo', password:'bar'})
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ id: 2, username: 'foo' })
  })

})