import { createClient } from "./client.ts"

process.loadEnvFile()
const POSTGREST_HOST = process.env['POSTGREST_HOST']

export const client = createClient(POSTGREST_HOST)
