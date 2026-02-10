import { client } from './database/clientInstance.ts'
import { default as express } from 'express'
import routes from './routes/index.ts'
import { createSelect, fromSelect } from './product.ts'

const todos = await createSelect(client).eq('name', 'Speyside Line').then(fromSelect)
console.log({ todos: todos[0].meta })
const app = express()
app.use(routes)
