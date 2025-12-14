# OpenRouter API Key (development setup)

If you see the server error `OPENROUTER_API_KEY not configured on server.`, follow these steps to add your API key locally and restart the Next.js dev server.

1) Create a `.env.local` file at the project root (same level as `package.json`).

Example `.env.local` (do NOT commit this file):

OPENROUTER_API_KEY=sk-REPLACE_WITH_YOUR_KEY

2) Restart the Next.js dev server so the environment variable is picked up.

If you run the dev server with npm / pnpm / yarn, use one of these (PowerShell):

# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

3) Verify

- Reproduce the action that triggered the error (create a new project). The server should now accept requests and forward them to OpenRouter.
- If you still see a 500, check the terminal where the dev server is running for startup logs and errors.

Security notes

- Never commit `.env.local` to source control. Add it to `.gitignore` if it's not already ignored.
- Do not embed the API key in client-side code. The proxy `app/api/openrouter/route.js` keeps the key on the server.

Troubleshooting

- If you're deploying to a remote environment, configure the `OPENROUTER_API_KEY` in your hosting provider's environment settings (Vercel, Netlify, etc.).
- If using Docker or containers, pass the secret as an environment variable to the container and restart.

If you want, I can add a small dev-only fallback that reads from `process.env.NEXT_PUBLIC_OPENROUTER_API_KEY` for quick local iteration — but that would expose the key to the client and is not recommended for production.
