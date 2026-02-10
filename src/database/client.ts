import { PostgrestClient } from "@supabase/postgrest-js"
import type { Database } from "./types.ts"

export function createClient(url: string) {
    return new PostgrestClient<Database>(url)
}

export type Client = PostgrestClient<Database>
