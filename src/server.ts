import { ApolloServer, gql } from 'apollo-server'

interface Category {
  id: number
  name: string
}

interface Task {
  id: number
  title: string
  category: Category
  priority: number
  done: boolean
}

interface TaskCondition {
  title: string
  category: number
  priority: number
  done: boolean
}

const typeDefs = gql`
  type Category {
    id: ID
    name: String
  }

  type Task {
    id: ID
    title: String
    category: Category
    priority: Int
    done: Boolean
  }

  input TaskCondition {
    title: String
    category: ID
    priority: Int
    done: Boolean
  }

  type Query {
    all: [Task]
    findByCategory(category: Int): [Task]
  }

  type Mutation {
    updateTask(id: ID, task: TaskCondition): Task
  }
`

const resolvers = {
  Query: {
    all: () => allTasks,
    findByCategory: (_: any, args: any) => {
      return allTasks.filter((task) => {
        return task.category.id === args.category
      })
    },
  },
  Mutation: {
    updateTask: (_: any, args: { id: string; task: TaskCondition }) => {
      const target = allTasks.find((t) => `${t.id}` === args.id)
      if (target) {
        const newValue = args.task
        if (newValue.title) {
          target.title = newValue.title
        }
      }
      return target
    },
  },
}

const allTasks: Task[] = [
  {
    id: 1,
    title: 'title1',
    category: { id: 1, name: 'category1' },
    priority: 10,
    done: false,
  },
  {
    id: 2,
    title: 'title2',
    category: { id: 1, name: 'category1' },
    priority: 7,
    done: false,
  },
  {
    id: 3,
    title: 'title3',
    category: { id: 2, name: 'category2' },
    priority: 5,
    done: false,
  },
]

export function init() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  return {
    start: async () => {
      const { url } = await server.listen()
      console.log(`🚀  Server ready at ${url}`)
    },
    stop: async () => {
      await server.stop()
    },
  }
}
