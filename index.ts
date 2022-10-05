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

  type Query {
    tasks: [Task]
  }
`

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

const resolvers = {
  Query: {
    tasks: () => allTasks,
  },
}

function main() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
}

main()
