interface User {
  id: string
  name: string
  email: string
}

interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  ownerId: string
}

type TaskStatus = 'OPEN' | 'INPROGRESS' | 'DONE'
type CreateUserInput = Omit<User, 'id'>
type CreateTaskInput = Omit<Task, 'id'>
type UpdateUserInput = Partial<Omit<User, 'id'>>
type UpdateTaskInput = Partial<Omit<Task, 'id' | 'ownerId'>>

const users: User[] = [
  {
    id: '1',
    name: 'Alice Smith',
    email: 'alice@example.com',
  },
  {
    id: '2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
  },
]

const tasks: Task[] = [
  {
    id: '1',
    title: 'Buy groceries',
    description: 'Milk, Bread, Eggs',
    status: 'OPEN',
    ownerId: '1',
  },
  {
    id: '2',
    title: 'Schedule dentist appointment',
    description: 'Visit Dr. Alice next week',
    status: 'OPEN',
    ownerId: '1',
  },
  {
    id: '3',
    title: 'Finish report',
    description: 'Complete the financial report for Q2',
    status: 'INPROGRESS',
    ownerId: '2',
  },
  {
    id: '4',
    title: 'Book flight tickets',
    description: 'Travel to New York in September',
    status: 'DONE',
    ownerId: '2',
  },
  {
    id: '5',
    title: 'Plan birthday party',
    description: 'Organize a surprise party for Bob',
    status: 'DONE',
    ownerId: '3',
  },
  {
    id: '6',
    title: 'Renew gym membership',
    description: 'Membership expires next month',
    status: 'OPEN',
    ownerId: '3',
  },
]

export const resolvers = {
  Query: {
    getTask: (_: any, args: { id: string }) =>
      tasks.find((task) => String(task.id) === args.id),
    getUser: (_: any, args: { id: string }) =>
      users.find((user) => String(user.id) === args.id),
    search: (_: any, args: { keyword: string | undefined | null }) => {
      const keyword = args.keyword
      if (keyword == null) {
        return [...tasks, ...users]
      }
      const matchedTasks = tasks.filter(
        (task) =>
          task.title.includes(keyword) || task.description.includes(keyword)
      )
      const matchedUsers = users.filter(
        (user) => user.name.includes(keyword) || user.email.includes(keyword)
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
    tasks: (user: User) => tasks.filter((task) => task.ownerId === user.id),
  },
  Task: {
    owner: (task: Task) => users.find((user) => user.id === task.ownerId),
  },
  Mutation: {
    createUser: (_: any, args: { input: CreateUserInput }): User => {
      const newUser = {
        id: String(users.length + 1),
        ...args.input,
        tasks: [],
      }
      users.push(newUser)
      return newUser
    },
    createTask: (_: any, args: { input: CreateTaskInput }): Task => {
      const user = users.find((user) => user.id === args.input.ownerId)
      const newTask = {
        id: String(tasks.length + 1),
        ...args.input,
        owner: user,
      }
      tasks.push(newTask)
      return newTask
    },
    updateUser: (
      _: any,
      args: { id: string; input: UpdateUserInput }
    ): User => {
      const user = users.find((user) => user.id === args.id)
      if (!user) {
        throw new Error(`User with ID ${args.id} not found`)
      }
      Object.assign(user, args.input)
      return user
    },
    updateTask: (
      _: any,
      args: { id: string; input: UpdateTaskInput }
    ): Task => {
      const task = tasks.find((task) => task.id === args.id)
      if (!task) {
        throw new Error(`Task with ID ${args.id} not found`)
      }
      Object.assign(task, args.input)
      return task
    },
  },
}
