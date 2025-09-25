// Budget Request model - handles all budget request database operations
import { query, queryOne } from "../database"

export interface BudgetRequest {
  id: number
  user_id: number
  client_name: string
  client_email: string
  client_phone: string
  scaffold_type: string
  scaffold_height: string
  tower_quantity: number
  status: "pending" | "responded" | "archived"
  items_data: Record<string, number>
  whatsapp_sent: boolean
  created_at: Date
  updated_at: Date
}

export interface CreateBudgetRequestData {
  user_id: number
  client_name: string
  client_email: string
  client_phone: string
  scaffold_type: string
  scaffold_height: string
  tower_quantity: number
  items_data: Record<string, number>
}

export interface BudgetRequestFilters {
  status?: string
  search?: string
  date_from?: string
  date_to?: string
}

// Create a new budget request
export async function createBudgetRequest(data: CreateBudgetRequestData): Promise<BudgetRequest> {
  const budgetRequest = await queryOne<BudgetRequest>(
    `INSERT INTO budget_requests (user_id, client_name, client_email, client_phone, scaffold_type, scaffold_height, tower_quantity, items_data)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      data.user_id,
      data.client_name,
      data.client_email,
      data.client_phone,
      data.scaffold_type,
      data.scaffold_height,
      data.tower_quantity,
      JSON.stringify(data.items_data),
    ],
  )

  if (!budgetRequest) {
    throw new Error("Failed to create budget request")
  }

  return budgetRequest
}

// Get budget request by ID
export async function getBudgetRequestById(id: number): Promise<BudgetRequest | null> {
  return queryOne<BudgetRequest>("SELECT * FROM budget_requests WHERE id = $1", [id])
}

// Get budget requests for a user with filters and pagination
export async function getBudgetRequestsForUser(
  userId: number,
  filters: BudgetRequestFilters = {},
  page = 1,
  limit = 20,
): Promise<{ requests: BudgetRequest[]; total: number }> {
  let whereClause = "WHERE user_id = $1"
  const params: any[] = [userId]
  let paramCount = 2

  // Apply filters
  if (filters.status && filters.status !== "all") {
    whereClause += ` AND status = $${paramCount}`
    params.push(filters.status)
    paramCount++
  }

  if (filters.search) {
    whereClause += ` AND (client_name ILIKE $${paramCount} OR client_email ILIKE $${paramCount})`
    params.push(`%${filters.search}%`)
    paramCount++
  }

  if (filters.date_from) {
    whereClause += ` AND created_at >= $${paramCount}`
    params.push(filters.date_from)
    paramCount++
  }

  if (filters.date_to) {
    whereClause += ` AND created_at <= $${paramCount}`
    params.push(filters.date_to)
    paramCount++
  }

  // Get total count
  const totalResult = await queryOne<{ count: string }>(
    `SELECT COUNT(*) as count FROM budget_requests ${whereClause}`,
    params,
  )
  const total = Number.parseInt(totalResult?.count || "0")

  // Get paginated results
  const offset = (page - 1) * limit
  params.push(limit, offset)

  const requests = await query<BudgetRequest>(
    `SELECT * FROM budget_requests ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
    params,
  )

  return { requests, total }
}

// Update budget request status
export async function updateBudgetRequestStatus(
  id: number,
  status: "pending" | "responded" | "archived",
): Promise<BudgetRequest | null> {
  return queryOne<BudgetRequest>("UPDATE budget_requests SET status = $1 WHERE id = $2 RETURNING *", [status, id])
}

// Mark WhatsApp as sent
export async function markWhatsAppSent(id: number): Promise<boolean> {
  const result = await query("UPDATE budget_requests SET whatsapp_sent = true WHERE id = $1", [id])
  return result.length > 0
}

// Get budget request statistics for a user
export async function getBudgetRequestStats(userId: number): Promise<{
  total: number
  pending: number
  responded: number
  today: number
}> {
  const stats = await queryOne<{
    total: string
    pending: string
    responded: string
    today: string
  }>(
    `SELECT 
       COUNT(*) as total,
       COUNT(*) FILTER (WHERE status = 'pending') as pending,
       COUNT(*) FILTER (WHERE status = 'responded') as responded,
       COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today
     FROM budget_requests 
     WHERE user_id = $1 AND status != 'archived'`,
    [userId],
  )

  return {
    total: Number.parseInt(stats?.total || "0"),
    pending: Number.parseInt(stats?.pending || "0"),
    responded: Number.parseInt(stats?.responded || "0"),
    today: Number.parseInt(stats?.today || "0"),
  }
}

// Delete budget request (soft delete)
export async function deleteBudgetRequest(id: number): Promise<boolean> {
  const result = await query("UPDATE budget_requests SET status = $1 WHERE id = $2", ["archived", id])
  return result.length > 0
}

// Get recent budget requests for dashboard
export async function getRecentBudgetRequests(userId: number, limit = 5): Promise<BudgetRequest[]> {
  return query<BudgetRequest>(
    `SELECT * FROM budget_requests 
     WHERE user_id = $1 AND status != 'archived'
     ORDER BY created_at DESC 
     LIMIT $2`,
    [userId, limit],
  )
}
