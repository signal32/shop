import { client } from './database/client.ts'

const todos = await client.from('todos').select('*')
console.log({ todos: todos.data })
