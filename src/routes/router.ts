import { createExpressOpenApiRouter } from 'openapi-ts-router/express'
import type { paths } from '#src/schema.d.ts';
import { Router } from "express";

export const router = Router()
export const openApiRouter = createExpressOpenApiRouter<paths>(router)
export type OpenApiRouter = typeof openApiRouter
