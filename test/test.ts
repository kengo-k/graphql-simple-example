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

test('get task(id=1)', async function () {
  const response = await axios.post('http://localhost:4000', {
    query: `query ($taskId: ID!) {
      getTask(id: $taskId) {
        id
        title
        description
        status
      }
    }`,
    variables: {
      taskId: '1',
    },
  })
  expect(response.data.data).toMatchObject({
    getTask: {
      id: '1',
      title: 'Buy groceries',
      description: 'Milk, Bread, Eggs',
      status: 'OPEN',
    },
  })
})

test('get task(id=1) with owner', async function () {
  const response = await axios.post('http://localhost:4000', {
    query: `query ($taskId: ID!) {
      getTask(id: $taskId) {
        id
        title
        description
        status
        owner {
          id
          name
          email
        }
      }
    }`,
    variables: {
      taskId: '1',
    },
  })
  expect(response.data.data).toMatchObject({
    getTask: {
      id: '1',
      title: 'Buy groceries',
      description: 'Milk, Bread, Eggs',
      status: 'OPEN',
      owner: {
        id: '1',
        name: 'Alice Smith',
        email: 'alice@example.com',
      },
    },
  })
})

test('search(keyword=Bob)', async function () {
  const response = await axios.post('http://localhost:4000', {
    query: `query($keyword: String) {
      search(keyword: $keyword) {
        __typename
        ... on User {
          id
          name
          email
        }
        ... on Task {
          id
          title
          description
          status
          owner {
            id
          }
        }
      }
    }`,
    variables: {
      keyword: 'Bob',
    },
  })
  expect(response.data.data).toMatchObject({
    search: [
      {
        __typename: 'Task',
        id: '5',
        title: 'Plan birthday party',
        description: 'Organize a surprise party for Bob',
        status: 'DONE',
        owner: {
          id: '3',
        },
      },
      {
        __typename: 'User',
        id: '2',
        name: 'Bob Johnson',
        email: 'bob@example.com',
      },
    ],
  })
})

test('a series of steps', async function () {
  const createUserRes = await axios.post('http://localhost:4000', {
    query: `mutation ($input: CreateUserInput!) {
      createUser(input: $input) {
        id
        name
        email
      }
    }`,
    variables: {
      input: {
        name: 'David Thompson',
        email: 'david@examplle.com',
      },
    },
  })
  expect(createUserRes.data.data).toMatchObject({
    createUser: {
      id: '4',
      name: 'David Thompson',
      email: 'david@examplle.com',
    },
  })

  const updateUserRes = await axios.post('http://localhost:4000', {
    query: `mutation($updateUserId: ID!, $input: UpdateUserInput!)  {
      updateUser(id: $updateUserId, input: $input) {
        id
        name
        email
      }
    }`,
    variables: {
      updateUserId: '4',
      input: {
        email: 'david@example.com',
      },
    },
  })
  expect(updateUserRes.data.data).toMatchObject({
    updateUser: {
      id: '4',
      name: 'David Thompson',
      email: 'david@example.com',
    },
  })

  const createTaskRes = await axios.post('http://localhost:4000', {
    query: `mutation($input: CreateTaskInput!)  {
      createTask(input: $input) {
        id
        title
        description
        status
        owner {
          id
        }
      }
    }`,
    variables: {
      input: {
        description: 'Buy basic GraphQL books',
        ownerId: '4',
        status: 'OPEN',
        title: 'Buy Books',
      },
    },
  })
  expect(createTaskRes.data.data).toMatchObject({
    createTask: {
      id: '7',
      title: 'Buy Books',
      description: 'Buy basic GraphQL books',
      status: 'OPEN',
      owner: {
        id: '4',
      },
    },
  })

  const updateTaskRes = await axios.post('http://localhost:4000', {
    query: `mutation UpdateTask($updateTaskId: ID!, $input: UpdateTaskInput!) {
      updateTask(id: $updateTaskId, input: $input) {
        id
        title
        description
        status
        owner {
          id
        }
      }
    }`,
    variables: {
      updateTaskId: '7',
      input: {
        status: 'DONE',
      },
    },
  })
  expect(updateTaskRes.data.data).toMatchObject({
    updateTask: {
      id: '7',
      title: 'Buy Books',
      description: 'Buy basic GraphQL books',
      status: 'DONE',
      owner: {
        id: '4',
      },
    },
  })

  const searchRes = await axios.post('http://localhost:4000', {
    query: `query($keyword: String) {
      search(keyword: $keyword) {
        ... on User {
          id
        }
        ... on Task {
          id
          owner {
            id
          }
        }
      }
    }`,
    variables: {
      keyword: 'Buy',
    },
  })
  expect(searchRes.data.data).toMatchObject({
    search: [
      {
        id: '1',
        owner: {
          id: '1',
        },
      },
      {
        id: '7',
        owner: {
          id: '4',
        },
      },
    ],
  })
})
