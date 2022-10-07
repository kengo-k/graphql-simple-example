import { resolvers } from './resolver'
import { typeDefs } from './schema'
import { ApolloServer } from 'apollo-server'

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
