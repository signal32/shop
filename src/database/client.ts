import { PostgrestClient } from "@supabase/postgrest-js"
import type { Database } from "./types.ts"

process.loadEnvFile()
const REST_URL = process.env['POSTGREST_HOST']

export const client = new PostgrestClient<Database>(REST_URL)
