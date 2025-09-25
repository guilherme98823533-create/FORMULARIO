import { neon } from "@neondatabase/serverless"

// Create SQL client using Neon
const sql = neon(process.env.FORMULARIOPRO_DATABASE_URL!)

// Execute a query with automatic connection management
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  try {
    console.log("[v0] Executing query:", text, "with params:", params)
    const result = await sql(text, params || [])
    console.log("[v0] Query result:", result)
    return result as T[]
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  }
}

// Execute a query and return a single row
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows.length > 0 ? rows[0] : null
}

// Execute multiple queries in a transaction
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  try {
    console.log("[v0] Starting transaction")
    await sql("BEGIN")

    // Create a client-like object that uses the same sql connection
    const client = {
      query: async (text: string, params?: any[]) => {
        const result = await sql(text, params || [])
        return { rows: result }
      },
    }

    const result = await callback(client)
    await sql("COMMIT")
    console.log("[v0] Transaction committed")
    return result
  } catch (error) {
    console.error("[v0] Transaction error:", error)
    try {
      await sql("ROLLBACK")
      console.log("[v0] Transaction rolled back")
    } catch (rollbackError) {
      console.error("[v0] Rollback error:", rollbackError)
    }
    throw error
  }
}

// Database health check
export async function healthCheck(): Promise<boolean> {
  try {
    await query("SELECT 1")
    return true
  } catch (error) {
    console.error("[v0] Database health check failed:", error)
    return false
  }
}
