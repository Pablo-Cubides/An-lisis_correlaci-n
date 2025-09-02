Docker branch guide

This repo contains a frontend Next.js app in `frontend/`.

Goal
- Create a `docker` branch with Dockerfile to run the app inside a container.

Files added
- `frontend/Dockerfile` - multi-stage Dockerfile to build and run the Next.js app
- `.dockerignore` - files to exclude from docker context

Create the `docker` branch and push

1. Create branch:
   git checkout -b docker
2. Commit the Dockerfile and .dockerignore
   git add frontend/Dockerfile .dockerignore DOCKER.md
   git commit -m "Add Dockerfile and docs for dockerized frontend"
3. Push:
   git push origin docker

Run locally with Docker

Build image:
```bash
docker build -t relational-insight-frontend -f frontend/Dockerfile .
```

Run container:
```bash
docker run -p 3000:3000 --rm relational-insight-frontend
```

Notes
- For Vercel deployment, use the `main` (or `production`) branch without Docker; Vercel builds the Next.js app automatically.
- This Dockerfile assumes `npm ci` works and that `package-lock.json` or `yarn.lock` is present. Adjust if you use `npm install` or `yarn`.
