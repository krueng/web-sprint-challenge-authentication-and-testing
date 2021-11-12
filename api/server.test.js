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
  test('register responds if missing username or password', async () => {
    const res = await request(server).post('/api/auth/register')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('username and password required')
  })
  test('register responds if username is taken', async () => {
    const res = await request(server).post('/api/auth/register').send({username:'user', password:'pass'})
    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/username taken/i)
  })
  test('register responds when registration is valid', async () => {
    const res = await request(server).post('/api/auth/register').send({username:'foo', password:'bar'})
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ id: 2, username: 'foo' })
  })
})

describe('[POST] /api/auth/login', () => {
  test('login responds for missing username or password', async () => {
    const res = await request(server).post('/api/auth/login')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('username and password required')
  })
  test('login responds for invalid username or password', async () => {
    const res = await request(server).post('/api/auth/login').send({ username: 'bar', password: 'foo' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('invalid credentials')
  })
  test('login responds when it is valid', async () => {
    const res = await request(server).post('/api/auth/login').send({ username: 'user', password: 'pass' })
    expect(res.status).toBe(200)
    expect(res.body.message).toMatch(/welcome, user/i)
  })
})

describe('[GET] /api/jokes', () => {
  test('jokes responds with valid token', async () => {
    let res = await request(server).post('/api/auth/login').send({ username: 'user', password: 'pass' })
    res = await request(server).get('/api/jokes').set('Authorization', res.body.token)
    expect(res.body).toMatchObject([
      {
        "id": "0189hNRf2g",
        "joke": "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
      },
      {
        "id": "08EQZ8EQukb",
        "joke": "Did you hear about the guy whose whole left side was cut off? He's all right now."
      },
      {
        "id": "08xHQCdx5Ed",
        "joke": "Why didn’t the skeleton cross the road? Because he had no guts."
      },
    ])
  })
})