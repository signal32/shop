import { router, openApiRouter } from './router.ts'

(await import('./calculateOrder.ts')).useOpenApiRouter(openApiRouter);
(await import('./productPrice.ts')).useOpenApiRouter(openApiRouter);
(await import('./createStripePayment.ts')).useOpenApiRouter(openApiRouter);
(await import('./generatePreSignedUploadUrl.ts')).useOpenApiRouter(openApiRouter);
(await import('./fulfillOrder.ts')).useOpenApiRouter(openApiRouter);
(await import('./getOrder.ts')).useOpenApiRouter(openApiRouter);

export { router }
