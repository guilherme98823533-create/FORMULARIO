// Database connection and query utilities
// This file provides a centralized way to interact with the PostgreSQL database

import { Pool, type PoolClient } from "pg"

// Database connection pool
let pool: Pool | null = null

// Initialize database connection pool
function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    // Handle pool errors
    pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err)
      process.exit(-1)
    })
  }

  return pool
}

// Execute a query with automatic connection management
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const pool = getPool()
  const client = await pool.connect()

  try {
    const result = await client.query(text, params)
    return result.rows
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  } finally {
    client.release()
  }
}

// Execute a query and return a single row
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows.length > 0 ? rows[0] : null
}

// Execute multiple queries in a transaction
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = getPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Transaction error:", error)
    throw error
  } finally {
    client.release()
  }
}

// Close the database connection pool
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}

// Database health check
export async function healthCheck(): Promise<boolean> {
  try {
    await query("SELECT 1")
    return true
  } catch (error) {
    console.error("Database health check failed:", error)
    return false
  }
}
