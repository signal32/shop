import { createClient } from "./client.ts"
import { Client, Pool } from 'pg';

process.loadEnvFile()
const POSTGREST_HOST = process.env['POSTGREST_HOST']

export const client = createClient(POSTGREST_HOST)

export const pgClient = new Client({
    host: 'localhost',
    port: 5432,
    user: process.env['POSTGRES_USER'],
    password: process.env['POSTGRES_PASSWORD'],
    database: process.env['POSTGRES_DB'],
})

export const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: process.env['POSTGRES_USER'],
    password: process.env['POSTGRES_PASSWORD'],
    database: process.env['POSTGRES_DB'],

    max: 10,              // max connections in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
