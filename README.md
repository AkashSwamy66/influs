# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Flask Backend

The backend is self-contained under `influs_backend/`, including its local environment file, virtual environment, and SQLite database. Install dependencies into its local environment:

```sh
influs_backend/.venv/bin/pip install -r influs_backend/requirements.txt
```

Run the API from the repository root:

```sh
influs_backend/.venv/bin/python influs_backend/app.py
```

For a fresh copy, create its environment with `python3 -m venv influs_backend/.venv`, install `influs_backend/requirements.txt`, and copy `influs_backend/.env.example` to `influs_backend/.env`. That local `.env` controls the Flask port, CORS, and database path. SQLite is stored at `influs_backend/instance/creators.sqlite3` and seeded with the six demo profiles on first run. API routes:

- `GET /api/health` checks that the service is running.
- `GET /api/creators` returns `{ "data": [...] }` for the marketplace.
- `GET /api/creators/<id>` returns one creator as `{ "data": {...} }`.
- `POST /api/creators` creates a profile and returns `201` with `{ "data": {...} }`. `name`, `category`, and `city` are required.
- `POST /api/auth/register/influencer` registers a creator account, hashes its password, and creates a discoverable creator profile. Required fields: `name`, `email`, `password` (at least 8 characters), `city`, `niche`, `followers`, `likes`, `views`, and `engagement` (0–100). Optional fields: `handle`, `bio`, `instagram`, `youtube`, `image`, and `rate`.
- `POST /api/auth/register/sponsor` registers a sponsor account with a hashed password and company details. Required fields: `companyName`, `email`, `password` (at least 8 characters), `industry`, and `companySize`; `website` is optional.
- `POST /api/auth/login` accepts `role`, `email`, and `password`; it returns an HS256 JWT bearer token that expires after seven days.
- `GET /api/me` returns the signed-in account and its profile. `PUT /api/me` updates the signed-in influencer's own profile; the creator ID is taken from the token, never from the request body.

Registration returns `201` with account `id`, `role`, and `email` (plus `creatorId` for influencer accounts). Passwords and hashes are never returned. Reusing an email for the same account role or an Instagram username already used by another creator returns `409`. Instagram usernames are normalized case-insensitively and constrained by a unique SQLite index.

`GET /api/creators`, `GET /api/creators/<id>`, and `POST /api/creators` require `Authorization: Bearer <token>`. The frontend redirects unauthenticated visitors to sign-in and only renders the marketplace after login. Influencers can open **My profile** to edit and save their own listing. The API signing key is generated in `influs_backend/instance/.auth_secret` when `SECRET_KEY` is not set; keep it private and persistent between restarts.

Influencer viewers do not receive other creators' contact email or Instagram profile link from creator list/detail endpoints. Sponsors can view creator contact details; an influencer can still access their own full profile through `/api/me` for editing.

Copy the root `.env.example` to `.env.local` to connect Vite to the local API, then restart Vite. Leave `VITE_API_BASE_URL` empty to use frontend sample data instead. For mobile testing, set it to `http://<computer-LAN-IP>:5001` and open the frontend through the same LAN IP. Flask CORS allows requests during development; restrict `CORS_ORIGINS` before deployment.

Creator responses include `id`, `name`, `category`, `city`, `followers`, `engagement`, `likes`, `views`, `price`, `rating`, `handle`, `contactEmail`, `image`, `bio`, `platforms`, `socialLinks`, and normalized `instagram_id`. Each social link has a `name` and `url`; include an Instagram entry for the Instagram contact action. Rating is platform-generated and starts at `0` for new profiles. Demo emails use `@example.com` and are not real contacts.

If the configured API request fails, the frontend keeps the sample profiles visible and displays a notice. Run API tests with `influs_backend/.venv/bin/python -m unittest discover -s influs_backend -v`.
