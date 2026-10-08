import createClient from "openapi-fetch";
import type { paths } from "./schema.d.ts";

export const defineClient = (baseUrl: string) => createClient<paths>({ baseUrl })
