import { execSync } from "child_process"

process.loadEnvFile()

const dbUrl = `postgresql://${process.env['POSTGRES_USER']}:${process.env['POSTGRES_PASSWORD']}@localhost:5432/store`
execSync(`npx supabase gen types typescript --db-url ${dbUrl} --schema shop > src/database/types.ts`)
