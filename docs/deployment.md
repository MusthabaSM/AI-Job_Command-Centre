# Connecting to a Live Lemma Backend

AI Alchemist is natively designed to integrate with a Lemma Pod backend.

## 1. Setup Environment
To execute the application in Production Mode, create a `.env.local` file in the `frontend/` directory based on the provided `.env.example`:

```bash
NEXT_PUBLIC_LEMMA_API_URL=https://<your-lemma-environment-url>/api
NEXT_PUBLIC_LEMMA_API_TOKEN=<your-api-key>
NEXT_PUBLIC_DEMO_MODE=false
```

## 2. Running the Lemma Pod
The backend logic is stored in the `/backend` directory. Import it into your Lemma workspace:
```bash
lemma pods import ./backend
```

## 3. Disabling Judge Mode
Ensure you do NOT click "Enter Judge Mode" on the login screen, as this sets a persistent `demo_mode` cookie that overrides the environment variables. If you accidentally trigger it, clear your cookies or click the standard "Sign In" button.
