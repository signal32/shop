import { PostgrestClient } from "@supabase/postgrest-js"
import type { Database } from "./types.ts"

process.loadEnvFile()
const POSTGREST_HOST = process.env['POSTGREST_HOST']

export const client = createClient(POSTGREST_HOST)

export function createClient(url: string) {
    return new PostgrestClient<Database>(url)
}
