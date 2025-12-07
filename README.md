# Harkwise Server

Backend API server for the Harkwise feedback platform.

## Setup Complete

The server has been initialized with the following stack:

- **Node.js + Express** - Web framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Database (to be configured)
- **Security** - Helmet, CORS
- **Code Quality** - ESLint, Prettier

## Project Structure

```
src/
  config/       # Environment configuration
  controllers/  # Route handlers (empty - ready for implementation)
  middlewares/  # Express middlewares (error handler, logger)
  routes/       # Route definitions (health check)
  services/     # Business logic (empty - ready for implementation)
  utils/        # Helper functions (empty - ready for implementation)
  app.ts        # Express app setup
  server.ts     # Server entry point
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled production build
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Check code with ESLint
- `npm run format` - Format code with Prettier

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env as needed
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Test health check:
   ```bash
   curl http://localhost:3001/health
   # Should return: {"status":"ok"}
   ```

## Current Features

- Health check endpoint: `GET /health`
- Global error handling
- Request logging
- Security headers (Helmet)
- CORS with configurable origins
- TypeScript strict mode
- Path aliases (`@/*`) for cleaner imports
- Jest testing infrastructure with supertest
- PostgreSQL client installed (ready for DB integration)

## Environment Variables

See `.env.example` for all available configuration options:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - CORS allowed origins (default: *)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Database connection

## Next Steps

Ready for feature development per the specs in `/tech/context/specs/`.
