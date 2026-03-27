import bodyParser from 'body-parser'
import cors from 'cors'
import { default as express } from 'express'
import routes from './routes/index.ts'

// const todos = await createSelect(client).eq('name', 'Speyside Line').then(fromSelect)
const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(routes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3004, () => {
    console.log(`App listening on port ${3004}`)
})
