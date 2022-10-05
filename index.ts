import { ApolloServer, gql } from 'apollo-server-express'
import express from 'express'

const typeDefs = gql`
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hello',
  },
}

async function main() {
  const apolloServer = new ApolloServer({ typeDefs, resolvers })
  await apolloServer.start()

  const app = express()
  apolloServer.applyMiddleware({ app })

  app.listen({ port: 3000 }, () =>
    console.log(
      `🚀 Server ready at http://localhost:3000${apolloServer.graphqlPath}`
    )
  )
}

main()
