import { init } from '../src/server'

const axios = require('axios')

const { start, stop } = init()
beforeAll(async () => {
  console.log('> start server...')
  await start()
})

afterAll(async () => {
  console.log('> stop server...')
  await stop()
})

test('1 + 1 = 2', function () {
  expect(1 + 1).toBe(2)
})

test('all', async function () {
  const response = await axios.post('http://localhost:4000', {
    query: `
        query {
          all {
            id
          }
        }`,
  })
  expect(response.data.data).toMatchObject({
    all: [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '3',
      },
    ],
  })
})
