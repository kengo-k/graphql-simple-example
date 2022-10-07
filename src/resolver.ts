import { Task, TaskCondition } from './types'

export const resolvers = {
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
