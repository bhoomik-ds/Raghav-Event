# Deployment

The project deploys as two services:

- `client/` on Vercel, with the Vercel project root set to `client`.
- `server/` on Render, using the included `render.yaml` blueprint.

## Vercel

Set this environment variable for the Vercel project:

```text
VITE_API_URL=https://raghav-event.onrender.com
```

The existing `client/vercel.json` keeps React Router routes working on refresh.

## Render

Create the service from `render.yaml`, or configure these values manually with `server` as the root directory:

```text
NODE_ENV=production
MONGODB_URI=<your-mongodb-connection-string>
DB_NAME=RaghavEvents
JWT_SECRET=<long-random-secret>
FRONTEND_URL=https://raghavevents.vercel.app
RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
```

Optional email and admin seeding variables are documented in `server/.env.example`.

The API health checks are available at `/health` and `/api/health`.

Never commit `.env` files. Rotate any credential that has been shared outside the deployment provider.
