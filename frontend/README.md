# Timesheet Web Application

A simple full-stack timesheet app with a Java Spring Boot backend and a React (Vite + TypeScript) frontend.

## Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+ (Node 20.19+ recommended for Vite 7, but this project pins Vite 5)
- npm 9+

## Backend (Spring Boot)

Commands (from repo root):

```bash
cd backend
mvn spring-boot:run
```

Backend runs at `http://localhost:8080` with H2 in-memory DB and exposes:
- `GET /api/timesheets`
- `POST /api/timesheets`
- `PUT /api/timesheets/{id}`
- `DELETE /api/timesheets/{id}`

H2 Console: `http://localhost:8080/h2` (JDBC URL: `jdbc:h2:mem:timesheetdb`)

## Frontend (React + Vite + TS)

Commands (from repo root):

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and proxies `/api` to the backend at `http://localhost:8080`.

## Notes
- CORS is configured on the backend to allow `http://localhost:5173`.
- Data is stored in-memory (H2). It resets on backend restart.

## Project Structure
- `backend/` Spring Boot app
- `frontend/` React app
