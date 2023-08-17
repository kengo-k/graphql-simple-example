interface User {
  id: number
  name: string
  email: string
}

interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  owner_id: number
}

type TaskStatus = 'OPEN' | 'INPROGRESS' | 'DONE'
type CreateUserRequest = Omit<User, 'id'>
type CreateTaskRequest = Omit<Task, 'id'>

const users: User[] = [
  {
    id: 1,
    name: 'Alice Smith',
    email: 'alice@example.com',
  },
  {
    id: 2,
    name: 'Bob Johnson',
    email: 'bob@example.com',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
  },
]

const tasks: Task[] = [
  {
    id: 1,
    title: 'Buy groceries',
    description: 'Milk, Bread, Eggs',
    status: 'OPEN',
    owner_id: 1,
  },
  {
    id: 2,
    title: 'Schedule dentist appointment',
    description: 'Visit Dr. Alice next week',
    status: 'OPEN',
    owner_id: 1,
  },
  {
    id: 3,
    title: 'Finish report',
    description: 'Complete the financial report for Q2',
    status: 'INPROGRESS',
    owner_id: 2,
  },
  {
    id: 4,
    title: 'Book flight tickets',
    description: 'Travel to New York in September',
    status: 'DONE',
    owner_id: 2,
  },
  {
    id: 5,
    title: 'Plan birthday party',
    description: 'Organize a surprise party for Bob',
    status: 'DONE',
    owner_id: 3,
  },
  {
    id: 6,
    title: 'Renew gym membership',
    description: 'Membership expires next month',
    status: 'OPEN',
    owner_id: 3,
  },
]

export const resolvers = {
  Query: {
    getTask: (_: any, args: { id: string }) =>
      tasks.find((task) => String(task.id) === args.id),
    getUser: (_: any, args: { id: string }) =>
      users.find((user) => String(user.id) === args.id),
    search: (_: any, args: { keyword: string }) => {
      const matchedTasks = tasks.filter(
        (task) =>
          task.title.includes(args.keyword) ||
          task.description.includes(args.keyword)
      )
      const matchedUsers = users.filter(
        (user) =>
          user.name.includes(args.keyword) || user.email.includes(args.keyword)
      )
      return [...matchedTasks, ...matchedUsers]
    },
  },
  SearchResult: {
    __resolveType: (result: User | Task) => {
      if ('email' in result) {
        return 'User'
      }
      if ('title' in result) {
        return 'Task'
      }
      return null
    },
  },
  User: {
    tasks: (user: User) => tasks.filter((task) => task.owner_id === user.id),
  },
  Task: {
    owner: (task: Task) => users.find((user) => user.id === task.owner_id),
  },
  Mutation: {
    createUser: (_: any, args: { input: CreateUserRequest }): User => {
      const newUser = {
        id: users.length + 1,
        ...args.input,
      }
      users.push(newUser)
      return newUser
    },
    createTask: (_: any, args: { input: CreateTaskRequest }): Task => {
      const newTask = {
        id: tasks.length + 1,
        ...args.input,
      }
      tasks.push(newTask)
      return newTask
    },
  },
}
