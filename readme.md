Database access is via PosgREST, using the supabase client with types generated using `node scripts/generateTypes.ts`.
This should be run as part of a database migration.

This DB is the source of truth for products.
A shopfront (i.e. my website) can read and augment a product.
For the ts sign creator, it will need to add a fancy file upload and preview window.
The image will be stored somewhere (probably within the ts sign service) and its id stored in the products options or metadata
This service will have a webhook invoked on payment success. I could add a webhook field to each product which is then also called - this would trigger the sign creation

When testing stripe payments when developing locally, use the stripe cli to forward webhook requests:
```
stripe listen --forward-to localhost:3004/stripe/webhook
```


### Database

To deploy all migrations:
```sh
node scripts/dbDeploy

```

To make a change:
```sh
sqitch add <change filename>
```
And then deploy
