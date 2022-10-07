export interface Category {
  id: number
  name: string
}

export interface Task {
  id: number
  title: string
  category: Category
  priority: number
  done: boolean
}

export interface TaskCondition {
  title: string
  category: number
  priority: number
  done: boolean
}
