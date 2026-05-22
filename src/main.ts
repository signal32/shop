import bodyParser from 'body-parser'
import cors from 'cors'
import { default as express } from 'express'
import routes from './routes/index.ts'
import { webhook } from './stripe.ts'

process.loadEnvFile()
const port = process.env['SHOP_PORT']

const app = express()

// Stripe webhook must be registered before middleware
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), webhook)

app.use(bodyParser.json())
app.use(cors())
app.use(routes)

app.get('/', (_req, res) => {
    res.send('Shop API')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
