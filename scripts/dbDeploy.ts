import { execSync } from "child_process"

process.loadEnvFile()

const user = process.env['POSTGRES_USER']
const password = process.env['POSTGRES_PASSWORD']
const database = process.env['POSTGRES_DB']
const host = process.env['POSTGRES_HOST']

execSync(`sqitch deploy db:pg://${user}:${password}@${host}/${database}`, { stdio: 'inherit' })
