# Running and deploying

## On one computer, for a demo

One server runs everything. This is the setup that was tested.

1. Set up MySQL and `.env` as described in the backend README.
2. In the frontend folder: `npm ci`, then `npm run build`.
3. In the backend `.env`, set `FRONTEND_DIR=../frontend/dist`.
4. In the backend folder: `mvn package -DskipTests`, then `java -jar target/portal-backend-0.1.0.jar`.
5. Open `http://localhost:8080`.

The built site has no one-click demo accounts; type the email and password, or use `npm run dev`.

## On a server

Not tested on a public host. You need a small Linux server with Java 21 and MySQL 8, a domain
name, and a web server that provides HTTPS, such as Caddy:

```
portal.your-domain.example {
    reverse_proxy 127.0.0.1:8080
}
```

Settings in `.env` on the server:

| Setting | Value |
|---|---|
| `COOKIE_SECURE` | `true` |
| `DEMO_DATA` | `false` (its password is public) |
| `JWT_SECRET` | new, 32 or more random characters, never reused from your laptop |
| `DB_PASSWORD` | a different password from your laptop |
| `FRONTEND_DIR` | folder with the built frontend |
| `UPLOAD_DIR` | a folder that is kept and backed up |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | for the first start only, then remove |
| `SERVER_FORWARD_HEADERS_STRATEGY` | `native`, so the real visitor address reaches the login limit. Set it as an environment variable of the service |

Keep port 8080 closed to the internet; the backend listens on 127.0.0.1 by default.

## Checklist

- [ ] HTTPS works and `http://` redirects to it
- [ ] Demo accounts cannot sign in
- [ ] The first admin can sign in, and `ADMIN_PASSWORD` is removed again
- [ ] Daily `mysqldump` and a copy of the photo folder; try restoring once
- [ ] `.env` is readable only by the service user

Free hosting platforms often delete uploaded files on restart. Photos would need file storage such as S3 there.
