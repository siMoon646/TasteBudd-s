// Load the variables from backend/.env into process.env (must run before DATABASE_URL is read below)
import 'dotenv/config';
// PrismaClient is the query builder used to talk to the database (prisma.user.findMany(), etc.)
import { PrismaClient } from '@prisma/client';
// Driver adapter that lets Prisma run its queries through the node-postgres ("pg") driver
import { PrismaPg } from '@prisma/adapter-pg';
// node-postgres, the low-level PostgreSQL driver for Node.js
import pg from 'pg';

// Create a connection pool: a set of reusable database connections,
// so each query doesn't have to open and close its own connection
const pool = new pg.Pool({
  // Where the database lives (user, password, host, port, db name), read from the environment
  connectionString: process.env.DATABASE_URL,
});

// Wrap the pool in the adapter so Prisma knows how to send queries through it
const adapter = new PrismaPg(pool);
// Create the Prisma client, telling it to use the adapter instead of its built-in engine
const prisma = new PrismaClient({ adapter });

// Export the single shared client so the rest of the backend imports this one instance
// rather than creating new clients (and new pools) of its own
export default prisma;
