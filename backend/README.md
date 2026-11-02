# Backend

## Requirements

- Node.js 20.19 or newer (Node.js 24 LTS recommended)
- MongoDB
- Visual Studio Build Tools with the **Desktop development with C++** workload on Windows when a native dependency does not have a prebuilt binary

## Install and configure

Run `npm ci` in this directory. Create a local `.env` file with the MongoDB connection string, frontend origin, host, port, Google OAuth credentials, and JWT secret. Do not commit `.env`.

## Run locally

- `npm run dev` starts the TypeScript server with Node.js watch mode.
- `npm run typecheck` checks TypeScript without generating files.
- `npm run build` compiles the server to `dist/`.
- `npm start` starts the compiled server.

MongoDB must be available before the server starts. Audio uploads are stored in MongoDB GridFS.
