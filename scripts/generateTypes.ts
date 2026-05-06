import { execSync } from "child_process"

process.loadEnvFile()

const envVars = [
    `PGHOST=localhost`, //TODO env
    `PGUSER=${process.env['POSTGRES_USER']}`,
    `PGPASSWORD=${process.env['POSTGRES_PASSWORD']}`,
    `PGDATABASE=${process.env['POSTGRES_DB']}`,
    `PGPORT=5432`, //TODO env
].join(' ')

execSync(`${envVars} npx pgtyped -c ./config.json`)
