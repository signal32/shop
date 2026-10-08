import bodyParser from 'body-parser'
import cors from 'cors'
import { default as express, Router } from 'express'
import { router } from './routes/index.ts'
import { router as customSignsRouter} from './customSigns/index.ts'
import { webhook } from './stripe.ts'
import swaggerUi from 'swagger-ui-express'
import yaml from 'yaml'
import fs from 'fs/promises'

process.loadEnvFile()
const port = process.env['SHOP_PORT']

const app = express()

// Stripe webhook must be registered before middleware
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), webhook)

app.use(cors())
app.use(bodyParser.json())
app.use(router)
app.use('/signs', customSignsRouter)

const spec = await fs.readFile('./openapi.yaml', 'utf8')
const doc = yaml.parse(spec)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(doc))

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
