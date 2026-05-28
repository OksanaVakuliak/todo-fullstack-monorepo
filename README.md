# Todo Fullstack Monorepo

Fullstack todo application with a React + Vite client and an Express + MongoDB API.

## Stack

- Client: React, TypeScript, Vite, Axios, TanStack Query
- Server: Node.js, Express, TypeScript, MongoDB, Mongoose, Zod
- Tooling: ESLint, Prettier, concurrently

## Project Structure

```text
client/   React application
server/   Express API
```

## Requirements

- Node.js 20+
- npm
- MongoDB connection string

## Environment Variables

Create local `.env` files from the examples:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

`client/.env`

```env
VITE_API_URL=http://localhost:4000
```

`server/.env`

```env
PORT=4000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/todo_app
```

## Installation

Install dependencies for both apps:

```bash
npm install
npm run install:all
```

Or install them separately:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

## Run Locally

Start client and server together:

```bash
npm run dev
```

Start only the server:

```bash
npm run dev:server
```

Start only the client:

```bash
npm run dev:client
```

Default local URLs:

- Client: `http://localhost:3000`
- Server: `http://localhost:4000`

## Scripts

Root scripts:

- `npm run dev` - run client and server in development mode
- `npm run dev:client` - run only the client
- `npm run dev:server` - run only the server
- `npm run install:all` - install client and server dependencies
- `npm run lint` - run lint checks for both apps
- `npm run lint:fix` - fix lint issues where possible
- `npm run format` - format both apps
- `npm run format:check` - check formatting for both apps

Client scripts:

- `npm run lint --prefix client` - run client lint checks
- `npm run lint:fix --prefix client` - fix client lint issues where possible
- `npm run format --prefix client` - format client files
- `npm run format:check --prefix client` - check client formatting
- `npm run build --prefix client` - build the client
- `npm run preview --prefix client` - preview the production client build

Server scripts:

- `npm run lint --prefix server` - run server TypeScript checks
- `npm run lint:fix --prefix server` - run server TypeScript checks
- `npm run format --prefix server` - format server files
- `npm run format:check --prefix server` - check server formatting
- `npm run build --prefix server` - compile the server
- `npm run start --prefix server` - run the compiled server
- `npm run test --prefix server` - run server tests
- `npm run test:coverage --prefix server` - run server tests with coverage

## API Routes

Base URL: `http://localhost:4000`

### Get Tasks

```http
GET /tasks
```

Query parameters:

- `page` - positive integer, default `1`
- `limit` - positive integer, minimum `5`, default `10`
- `search` - optional text search string

Example:

```http
GET /tasks?page=1&limit=5&search=work
```

Response:

```json
{
  "page": 1,
  "limit": 5,
  "totalPages": 1,
  "totalTasks": 1,
  "tasks": [
    {
      "_id": "665000000000000000000000",
      "title": "Plan sprint",
      "content": "Prepare backlog items",
      "createdAt": "2026-05-28T10:00:00.000Z",
      "updatedAt": "2026-05-28T10:00:00.000Z"
    }
  ]
}
```

### Get Task By ID

```http
GET /tasks/:id
```

Returns one task by MongoDB ObjectId.

### Create Task

```http
POST /tasks
```

Body:

```json
{
  "title": "Plan sprint",
  "content": "Prepare backlog items"
}
```

Validation:

- `title` is required and must be 50 characters or less
- `content` is optional and must be 500 characters or less

### Delete Task

```http
DELETE /tasks/:id
```

Deletes one task by MongoDB ObjectId.
