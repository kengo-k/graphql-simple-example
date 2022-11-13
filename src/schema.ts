import { gql } from 'apollo-server'

export const typeDefs = gql`
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
    children: [Task]
  }

  input TaskCondition {
    title: String
    category: ID
    priority: Int
    done: Boolean
  }

  type AddTaskResult {
    task: Task
    result: ResultCode
  }

  type Success {
    newId: ID
  }

  type Error {
    message: String
  }

  union ResultCode = Success | Error

  type Query {
    all: [Task]
    findByCategory(category: Int): [Task]
  }

  type Mutation {
    updateTask(id: ID, task: TaskCondition): Task
    addTask(task: TaskCondition): AddTaskResult
  }
`
