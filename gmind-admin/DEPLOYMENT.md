# Ubuntu deployment

Use the same Ubuntu server path/process as before, then run the app from `gmind-admin`.

```bash
cp .env.example .env
nano .env
npm ci
npm run generate
npm run migrate
npm run seed
npm run build
npm run start
```

Required production values:

- `DATABASE_URL`: Postgres connection string on the server.
- `AUTH_SECRET` and `NEXTAUTH_SECRET`: same strong random value.
- `AUTH_URL` and `NEXTAUTH_URL`: public app URL.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`: admin login created or reset by `npm run seed`.

If the server uses PM2, run `npm run start` through the existing PM2 app config instead of starting it directly in the shell.
