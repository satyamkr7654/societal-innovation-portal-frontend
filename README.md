# Societal Innovation Portal: frontend

React 19, Vite, Tailwind CSS. Start the API in `../backend` first (see its README).

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Development server; forwards `/api` to port 8080 |
| `npm test` | Automated tests |
| `npm run lint` / `npm run build` | Check code / production build |

Pages call `src/services`, which is the only code that talks to the API.
