import { init } from '../src/server'

const { start, stop } = init()
beforeAll(async () => {
  console.log('> start server...')
  await start()
})

afterAll(async () => {
  console.log('> stop server...')
  await stop()
})

test('1 = 1', function () {
  expect(1).toBe(1)
})
