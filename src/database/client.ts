import { Client, Pool, type ClientConfig } from 'pg';

process.loadEnvFile()

const CLIENT_CONFIG: ClientConfig = {
    host: process.env['POSTGRES_HOST'],
    port: +(process.env['POSTGRES_PORT'] ?? 5432),
    user: process.env['POSTGRES_USER'],
    password: process.env['POSTGRES_PASSWORD'],
    database: process.env['POSTGRES_DB'],
    connectionTimeoutMillis: 2000
}

export const client = new Client(CLIENT_CONFIG)

export const pool = new Pool({
    ...CLIENT_CONFIG,
    max: 10,
    idleTimeoutMillis: 30000,
});
