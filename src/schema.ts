import { gql } from 'apollo-server'

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    owner: User!
  }

  enum TaskStatus {
    OPEN
    INPROGRESS
    DONE
  }

  union SearchResult = User | Task

  input CreateUserInput {
    name: String!
    email: String!
  }

  input CreateTaskInput {
    title: String!
    description: String
    status: TaskStatus!
    ownerId: ID!
  }

  input UpdateUserInput {
    name: String
    email: String
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: TaskStatus
  }

  type Query {
    getUser(id: ID!): User
    getTask(id: ID!): Task
    search(keyword: String): [SearchResult!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    createTask(input: CreateTaskInput!): Task
    updateUser(id: ID!, input: UpdateUserInput!): User
    updateTask(id: ID!, input: UpdateTaskInput!): Task
  }
`
