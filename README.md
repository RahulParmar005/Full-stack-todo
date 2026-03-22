# Full Stack Todo App

[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-purple?style=for-the-badge&logo=postgresql)](https://postgresql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/Vite-7-orange?style=for-the-badge&logo=vite)](https://vitejs.dev)

A modern, secure **full-stack Todo application** built with React, Node.js/Express, and PostgreSQL. Features user authentication, CRUD operations on user-specific todos, real-time editing, and responsive UI with Material-UI and TailwindCSS.

## Features

| Feature | Description |
|---------|-------------|
| **User Authentication** | Secure register/login/logout with email/password. Persistent sessions via JWT cookies. |
| **Todo Management** | Create, read, update, delete, toggle-complete todos (user-isolated). |
| **Inline Editing** | Real-time edit descriptions with Enter/Esc shortcuts. Visual completion toggle. |
| **Responsive UI** | Modern design with rounded cards, shadows, loading states, error handling. Works on all devices. |
| **Protected Routes** | All todos private to authenticated users. No cross-user data access. |

## Security

- **Password Protection**: Bcrypt hashing (10 salt rounds).
- **JWT Authentication**: HttpOnly cookies (secure in production, SameSite=Strict, 30-day expiry).
- **Protected Endpoints**: Middleware verifies JWT and user ownership.
- **Input Validation**: Required fields, email uniqueness, type checks.
- **CORS**: Restricted to client origin only.
- **SQL Safety**: Parameterized queries prevent injection.

## Tech Stack

### Frontend
- **React 19** + **React Router**
- **Vite 7** (fast dev/build)
- **TailwindCSS 4** + **MUI Icons**
- **Axios** for API calls

### Backend
- **Node.js/Express 5**
- **PostgreSQL** (pg pool)
- **JWT + bcrypt** for auth
- **cookie-parser + cors**

### Dev Tools
- Nodemon (server)
- dotenv (env vars)

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ (create DB `todo_app`, tables: `users`, `todos`)

### Setup
1. Clone & Install:
   ```bash
   git clone <repo> && cd Full-Stack-Todo-App
   cd client && npm install && cd ../server && npm install
   ```

2. Environment Variables (`.env` in `server/`):
   ```
   DB_USER=your_pg_user
   DB_HOST=localhost
   DB_NAME=todo_app
   DB_PASSWORD=your_password
   DB_PORT=5432
   JWT_SECRET=your_super_secret_key
   CLIENT_URL=http://localhost:5173
   PORT=5000
   ```

3. Database Schema (run in PostgreSQL):
   ```sql
   CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(255));
   CREATE TABLE todos (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), description TEXT, completed BOOLEAN DEFAULT FALSE);
   ```

4. Run:
   ```bash
   # Terminal 1: Backend
   cd server && npm start
   # Terminal 2: Frontend
   cd client && npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173)

## API Endpoints

All prefixed `/api/auth`. Auth required for todos.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Create user (name, email, password) | No |
| POST | `/login` | Login (email, password) | No |
| GET | `/me` | Current user | Yes |
| POST | `/logout` | Logout | Yes |
| POST | `/me/todos` | Create todo | Yes |
| GET | `/me/todos` | List todos | Yes |
| PUT | `/me/todos/:id` | Update todo | Yes |
| DELETE | `/me/todos/:id` | Delete todo | Yes |