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
            title
            done
            children {
              id
              title
              done
            }
          }
        }`,
  })
  expect(response.data.data).toMatchObject({
    all: [
      {
        children: [
          {
            done: false,
            id: '4',
            title: 'title1-1',
          },
          {
            done: false,
            id: '5',
            title: 'title1-2',
          },
        ],
        done: false,
        id: '1',
        title: 'title1',
      },
      {
        children: [],
        done: false,
        id: '2',
        title: 'title2',
      },
      {
        children: [],
        done: false,
        id: '3',
        title: 'title3',
      },
    ],
  })
})

test('find by category = 2', async function () {
  const response = await axios.post('http://localhost:4000', {
    query: `query {
              findByCategory(category: 2) {
                id
              }
            }`,
  })
  expect(response.data.data).toMatchObject({
    findByCategory: [
      {
        id: '3',
      },
    ],
  })
})

test('update task title', async function () {
  const response = await axios.post('http://localhost:4000', {
    query: `
        mutation {
          updateTask(id: 1, task: {title: "title999"}) {
            id
            title
          }
        }`,
  })
  expect(response.data.data).toMatchObject({
    updateTask: {
      id: '1',
      title: 'title999',
    },
  })
})

test('update task title with varialbes', async function () {
  const response = await axios.post('http://localhost:4000', {
    query: `
        mutation($id: ID, $task: TaskCondition) {
          updateTask(id: $id, task: $task) {
            id
            title
          }
        }`,
    variables: {
      id: 1,
      task: {
        title: 'title998',
      },
    },
  })
  expect(response.data.data).toMatchObject({
    updateTask: {
      id: '1',
      title: 'title998',
    },
  })
})

test('all(2nd)', async function () {
  const response = await axios.post('http://localhost:4000', {
    query: `
        query {
          all {
            id
            title
          }
        }`,
  })
  expect(response.data.data).toMatchObject({
    all: [
      {
        id: '1',
        title: 'title998',
      },
      {
        id: '2',
        title: 'title2',
      },
      {
        id: '3',
        title: 'title3',
      },
    ],
  })
})
